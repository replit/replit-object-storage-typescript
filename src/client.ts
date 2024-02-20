import { PassThrough, type Readable } from 'stream';
import {
  Bucket,
  Storage,
  UploadOptions as GoogleUploadOptions,
} from '@google-cloud/storage';

import { REPLIT_ADC } from './config';
import { errFromGoogleErr, File, parseFile } from './gcsApi';
import { getDefaultBucketId } from './sidecar';
import { Ok, Result } from './result';

export interface CreateClientOptions {
  bucketId?: string;
}

enum ClientStatus {
  Error = 'error',
  Initializing = 'initializing',
  Ready = 'ready',
}

export interface DeleteOptions {
  ignoreNotFound?: boolean;
  ifGenerationMatch?: number | string;
  ifGenerationNotMatch?: number | string;
  ifMetagenerationMatch?: number | string;
  ifMetagenerationNotMatch?: number | string;
}

export interface DownloadOptions {
  decompress?: boolean;
}

export interface GetSignedUrlOptions {
  expires: Date;
}

export interface ListOptions {
  matchGlob?: string;
  maxResults?: number;
  prefix?: string;
}

export interface UploadOptions {
  compress?: boolean;
}

type State =
  | { status: ClientStatus.Initializing; promise: Promise<Bucket> }
  | { status: ClientStatus.Ready; bucket: Bucket }
  | { status: ClientStatus.Error; error: string };

export class Client {
  private state: State;

  constructor(bucketId?: string) {
    this.state = {
      status: ClientStatus.Initializing,
      promise: this.init(bucketId),
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

  async copy(
    objectName: string,
    destObjectName: string,
  ): Promise<Result<null>> {
    const bucket = await this.getBucket();
    try {
      await bucket.file(objectName).copy(destObjectName);
    } catch (error) {
      return errFromGoogleErr(error);
    }
    return Ok(null);
  }

  async delete(
    objectName: string,
    options?: DeleteOptions,
  ): Promise<Result<null>> {
    const bucket = await this.getBucket();
    try {
      await bucket.file(objectName).delete(options);
    } catch (error) {
      return errFromGoogleErr(error);
    }
    return Ok(null);
  }

  async downloadAsBytes(
    objectName: string,
    options?: DownloadOptions,
  ): Promise<Result<[Buffer]>> {
    const bucket = await this.getBucket();
    try {
      const buffer = await bucket.file(objectName).download(options);
      return Ok(buffer);
    } catch (error) {
      return errFromGoogleErr(error);
    }
  }

  async downloadAsText(
    objectName: string,
    options?: DownloadOptions,
  ): Promise<Result<string>> {
    const bucket = await this.getBucket();
    try {
      const buffer = await bucket.file(objectName).download(options);
      const text = buffer.toString();
      return Ok(text);
    } catch (error) {
      return errFromGoogleErr(error);
    }
  }

  async downloadToFilename(
    objectName: string,
    destFilename: string,
    options?: DownloadOptions,
  ): Promise<Result<null>> {
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

  downloadAsStream(objectName: string): Result<Readable> {
    const passThrough = new PassThrough();

    this.getBucket()
      .then((bucket) => {
        bucket.file(objectName).createReadStream().pipe(passThrough);
      })
      .catch((err) => {
        passThrough.emit('error', err);
      });

    return Ok(passThrough);
  }

  async exists(objectName: string): Promise<Result<boolean>> {
    const bucket = await this.getBucket();
    try {
      const response = await bucket.file(objectName).exists();
      return Ok(response[0]);
    } catch (error) {
      return errFromGoogleErr(error);
    }
  }

  async list(options?: ListOptions): Promise<Result<Array<File>>> {
    const bucket = await this.getBucket();
    try {
      const [googleFiles] = await bucket.getFiles({
        ...options,
        autoPaginate: true,
        versions: false,
      });
      const files = googleFiles.map(parseFile);
      return Ok(files);
    } catch (error) {
      return errFromGoogleErr(error);
    }
  }

  async uploadFromBytes(
    objectName: string,
    contents: Buffer,
    options?: UploadOptions,
  ): Promise<Result<null>> {
    const bucket = await this.getBucket();
    const mappedOptions = this.mapUploadOptions(options);
    try {
      await bucket.file(objectName).save(contents, mappedOptions);
    } catch (error) {
      return errFromGoogleErr(error);
    }
    return Ok(null);
  }

  async uploadFromText(
    objectName: string,
    contents: string,
    options?: UploadOptions,
  ): Promise<Result<null>> {
    const bucket = await this.getBucket();
    const mappedOptions = this.mapUploadOptions(options);
    try {
      await bucket.file(objectName).save(contents, mappedOptions);
    } catch (error) {
      return errFromGoogleErr(error);
    }
    return Ok(null);
  }

  async uploadFromFilename(
    objectName: string,
    srcFilename: string,
    options?: UploadOptions,
  ): Promise<Result<null>> {
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
          // gcloud lib can return non-error types as errors.
          if (!err.stack) {
            reject(new Error(JSON.stringify(err)));

            return;
          }

          reject(err);
        })
        .on('finish', () => {
          resolve();
        });
    });
  }
}
