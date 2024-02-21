import { PassThrough, type Readable } from 'stream';
import {
  Bucket,
  Storage,
  UploadOptions as GoogleUploadOptions,
} from '@google-cloud/storage';

import { RequestError, StorageObject, StreamRequestError } from './';
import { REPLIT_ADC } from './config';
import { errFromGoogleErr, parseFile } from './gcsApi';
import { getDefaultBucketId } from './sidecar';
import { Ok, Result } from './result';

/**
 * Configuration options for client creation.
 */
export interface ClientOptions {
  /**
   * The ID of the bucket the client will interact with.
   * If none is specified, the default bucket will be used.
   * @public
   */
  bucketId?: string;
}

/**
 * Configuration options for object deletion.
 * @public
 */
export interface DeleteOptions {
  /**
   * If specified, no error will be raised if the specified object does not exist.
   * False by default.
   */
  ignoreNotFound?: boolean;
}

/**
 * Configuration options for object download.
 * @public
 */
export interface DownloadOptions {
  /**
   * Whether the object should be decompressed, if uploaded using the `compress` flag.
   * True by default.
   */
  decompress?: boolean;
}

/**
 * Configuration options for listing objects in a bucket.
 * @public
 */
export interface ListOptions {
  /**
   * Filter results to objects whose names are
   * lexicographically before endOffset. If startOffset is also set, the objects
   * listed have names between startOffset (inclusive) and endOffset (exclusive).
   */
  endOffset?: string;
  /**
   * Glob pattern used to filter results, for example foo*bar.
   */
  matchGlob?: string;
  /**
   * The maximum number of results that can be returned in the response.
   */
  maxResults?: number;
  /**
   * Filter results to objects who names have the specified prefix.
   */
  prefix?: string;
  /**
   * Filter results to objects whose names are
   * lexicographically equal to or after startOffset. If endOffset is also set,
   * the objects listed have names between startOffset (inclusive) and endOffset (exclusive).
   */
  startOffset?: string;
}

/**
 * Configuration options for object upload.
 * @public
 */
export interface UploadOptions {
  /**
   * Whether the object should be compressed upon receipt of data.
   * This reduces at-rest storage cost but does not impact data transfer.
   * True by default.
   */
  compress?: boolean;
}

enum ClientStatus {
  Error = 'error',
  Initializing = 'initializing',
  Ready = 'ready',
}

type State =
  | { status: ClientStatus.Initializing; promise: Promise<Bucket> }
  | { status: ClientStatus.Ready; bucket: Bucket }
  | { status: ClientStatus.Error; error: string };

/**
 * Class representing a client to communicate with Object Storage from Replit.
 * @public
 */
export class Client {
  private state: State;

  /**
   * Creates a new client.
   * @param bucketId - the ID of the bucket this client will interact with. If none is specified, the default bucket will be used.
   */
  constructor(options?: ClientOptions) {
    this.state = {
      status: ClientStatus.Initializing,
      promise: this.init(options?.bucketId),
    };
  }

  private async init(bucketId?: string) {
    try {
      const gcsClient = new Storage({
        credentials: REPLIT_ADC,
        projectId: '',
      });

      const bucket = gcsClient.bucket(bucketId ?? (await getDefaultBucketId()));

      this.state = {
        status: ClientStatus.Ready,
        bucket,
      };

      return bucket;
    } catch (e) {
      this.state = {
        status: ClientStatus.Error,
        error:
          e instanceof Error
            ? `Error during client initialization: ${e.message}`
            : 'Unknown error',
      };

      throw e;
    }
  }

  private async getBucket(): Promise<Bucket> {
    if (this.state.status === ClientStatus.Initializing) {
      return this.state.promise;
    }

    if (this.state.status === ClientStatus.Error) {
      throw new Error(this.state.error);
    }

    return this.state.bucket;
  }

  private mapUploadOptions(
    options?: UploadOptions,
  ): GoogleUploadOptions | undefined {
    if (!options) {
      return;
    }

    const gzip = options.compress;
    return { gzip };
  }

  /**
   * Copies the specified object within the same bucket.
   * If an object exists in the same location, it will be overwritten.
   * @param objectName - The full path of the object to copy.
   * @param destObjectName - The full path to copy the object to.
   */
  async copy(
    objectName: string,
    destObjectName: string,
  ): Promise<Result<null, RequestError>> {
    const bucket = await this.getBucket();
    try {
      await bucket.file(objectName).copy(destObjectName);
    } catch (error) {
      return errFromGoogleErr(error);
    }
    return Ok(null);
  }

  /**
   * Deletes the specified object.
   * @param objectName - The full path of the object to delete.
   * @param options - Configurations for the delete operation.
   */
  async delete(
    objectName: string,
    options?: DeleteOptions,
  ): Promise<Result<null, RequestError>> {
    const bucket = await this.getBucket();
    try {
      await bucket.file(objectName).delete(options);
    } catch (error) {
      return errFromGoogleErr(error);
    }
    return Ok(null);
  }

  /**
   * Downloads an object as a buffer containing the object's raw contents.
   * @param objectName - The full path of the object to download.
   * @param options - Configurations for the download operation.
   */
  async downloadAsBytes(
    objectName: string,
    options?: DownloadOptions,
  ): Promise<Result<[Buffer], RequestError>> {
    const bucket = await this.getBucket();
    try {
      const buffer = await bucket.file(objectName).download(options);
      return Ok(buffer);
    } catch (error) {
      return errFromGoogleErr(error);
    }
  }

  /**
   * Downloads a object to a string and returns the string.
   * @param objectName - The full path of the object to download.
   * @param options - Configurations for the download operation.
   */
  async downloadAsText(
    objectName: string,
    options?: DownloadOptions,
  ): Promise<Result<string, RequestError>> {
    const bucket = await this.getBucket();
    try {
      const buffer = await bucket.file(objectName).download(options);
      const text = buffer.toString();
      return Ok(text);
    } catch (error) {
      return errFromGoogleErr(error);
    }
  }

  /**
   * Downloads an object to the local filesystem.
   * @param objectName - The full path of the object to download.
   * @param destFilename - The path on the local filesystem to write the downloaded object to.
   * @param options - Configurations for the download operation.
   */
  async downloadToFilename(
    objectName: string,
    destFilename: string,
    options?: DownloadOptions,
  ): Promise<Result<null, RequestError>> {
    const bucket = await this.getBucket();

    bucket.file(objectName).createReadStream();
    try {
      await bucket.file(objectName).download({
        ...options,
        destination: destFilename,
      });
    } catch (error) {
      return errFromGoogleErr(error);
    }
    return Ok(null);
  }

  /**
   * Opens a new stream and streams the object's contents.
   * If an error is encountered, it will be emitted through the stream.
   * @param objectName - The full path of the object to download.
   * @param options - Configurations for the download operation.
   */
  downloadAsStream(objectName: string, options?: DownloadOptions): Readable {
    const passThrough = new PassThrough();

    this.getBucket()
      .then((bucket) => {
        bucket
          .file(objectName)
          .createReadStream(options)
          .on('error', (err) => {
            const { error: reqErr } = errFromGoogleErr(err);
            passThrough.emit('error', new StreamRequestError(reqErr));
          })
          .pipe(passThrough);
      })
      .catch((err) => {
        const { error: reqErr } = errFromGoogleErr(err);
        passThrough.emit('error', new StreamRequestError(reqErr));
      });

    return passThrough;
  }

  /**
   * Checks whether the given object exists.
   * @param objectName - The full path of the object to check.
   */
  async exists(objectName: string): Promise<Result<boolean, RequestError>> {
    const bucket = await this.getBucket();
    try {
      const response = await bucket.file(objectName).exists();
      return Ok(response[0]);
    } catch (error) {
      return errFromGoogleErr(error);
    }
  }

  /**
   * Lists objects in the bucket.
   * @param options - Configurations for the list operation.
   */
  async list(
    options?: ListOptions,
  ): Promise<Result<Array<StorageObject>, RequestError>> {
    const bucket = await this.getBucket();
    try {
      const [googleFiles] = await bucket.getFiles({
        ...options,
        autoPaginate: true,
        versions: false,
      });
      const objects = googleFiles.map(parseFile);
      return Ok(objects);
    } catch (error) {
      return errFromGoogleErr(error);
    }
  }

  /**
   * Uploads an object from its in-memory byte representation.
   * If an object already exists with the specified name it will be overwritten.
   * @param objectName - The full destination path of the object.
   * @param contents - The raw contents of the object in byte form.
   * @param options - Configurations for the upload operation.
   */
  async uploadFromBytes(
    objectName: string,
    contents: Buffer,
    options?: UploadOptions,
  ): Promise<Result<null, RequestError>> {
    const bucket = await this.getBucket();
    const mappedOptions = this.mapUploadOptions(options);
    try {
      await bucket.file(objectName).save(contents, mappedOptions);
    } catch (error) {
      return errFromGoogleErr(error);
    }
    return Ok(null);
  }

  /**
   * Uploads an object from its in-memory text representation.
   * If an object already exists with the specified name it will be overwritten.
   * @param objectName - The full destination path of the object.
   * @param contents - The contents of the object in text form.
   * @param options - Configurations for the upload operation.
   */
  async uploadFromText(
    objectName: string,
    contents: string,
    options?: UploadOptions,
  ): Promise<Result<null, RequestError>> {
    const bucket = await this.getBucket();
    const mappedOptions = this.mapUploadOptions(options);
    try {
      await bucket.file(objectName).save(contents, mappedOptions);
    } catch (error) {
      return errFromGoogleErr(error);
    }
    return Ok(null);
  }

  /**
   * Uploads an object from a file on the local filesystem.
   * If an object already exists with the specified name it will be overwritten.
   * @param objectName - The full destination path of the object.
   * @param srcFilename - The path of the file on the local filesystem to upload.
   * @param options - Configurations for the upload operation.
   */
  async uploadFromFilename(
    objectName: string,
    srcFilename: string,
    options?: UploadOptions,
  ): Promise<Result<null, RequestError>> {
    const bucket = await this.getBucket();
    const mappedOptions = this.mapUploadOptions(options);
    try {
      await bucket.upload(srcFilename, {
        ...mappedOptions,
        destination: objectName,
      });
    } catch (error) {
      return errFromGoogleErr(error);
    }
    return Ok(null);
  }

  /**
   * Uploads an object by streaming its contents from the provided stream.
   * If an error is encountered, it will be emitted through the stream. If an object already exists with the specified name it will be overwritten.
   * @param objectName - The full destination path of the object.
   * @param stream - A writeable stream the object will be written from.
   * @param options - Configurations for the upload operation.
   */
  async uploadFromStream(
    objectName: string,
    stream: Readable,
    options?: UploadOptions,
  ): Promise<void> {
    const bucket = await this.getBucket();
    const mappedOptions = this.mapUploadOptions(options);
    return new Promise((resolve, reject) => {
      stream
        .pipe(
          bucket
            .file(objectName)
            .createWriteStream({ ...mappedOptions, resumable: false }),
        )
        .on('error', (err) => {
          const { error: reqErr } = errFromGoogleErr(err);
          reject(new StreamRequestError(reqErr));
        })
        .on('finish', () => {
          resolve();
        });
    });
  }
}
