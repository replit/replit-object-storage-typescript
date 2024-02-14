import { PassThrough, type Readable } from 'stream';
import { Bucket, Storage } from '@google-cloud/storage';

import { REPLIT_ADC } from './config';
import { getDefaultBucketId } from './sidecar';

export interface CreateClientOptions {
  bucketId?: string;
}

type State =
  | { status: 'initializing'; promise: Promise<Bucket> }
  | { status: 'ready'; bucket: Bucket }
  | { status: 'error'; error: string };

export class Client {
  private state: State;

  constructor(bucketId?: string) {
    this.state = {
      status: 'initializing',
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
        status: 'ready',
        bucket,
      };

      return bucket;
    } catch (e) {
      this.state = {
        status: 'error',
        error:
          e instanceof Error
            ? `Error during client initialization: ${e.message}`
            : 'Unknown error',
      };

      throw e;
    }
  }

  private async getBucket(): Promise<Bucket> {
    if (this.state.status === 'initializing') {
      return this.state.promise;
    }

    if (this.state.status === 'error') {
      throw new Error(this.state.error);
    }

    return this.state.bucket;
  }

  async delete(objectName: string): Promise<void> {
    const bucket = await this.getBucket();
    await bucket.file(objectName).delete();
  }

  async downloadAsBytes(objectName: string): Promise<[Buffer]> {
    const bucket = await this.getBucket();
    return bucket.file(objectName).download();
  }

  async downloadAsText(objectName: string): Promise<string> {
    const bucket = await this.getBucket();
    const response = await bucket.file(objectName).download();
    return response.toString();
  }

  async downloadToFilename(
    objectName: string,
    destFilename: string,
  ): Promise<void> {
    const bucket = await this.getBucket();
    await bucket.file(objectName).download({
      destination: destFilename,
    });
  }

  downloadFileAsStream(objectName: string): Readable {
    const passThrough = new PassThrough();

    this.getBucket()
      .then((bucket) => {
        bucket.file(objectName).createReadStream().pipe(passThrough);
      })
      .catch((err) => {
        passThrough.emit('error', err);
      });

    return passThrough;
  }

  async list(prefix: string): Promise<Array<string>> {
    const bucket = await this.getBucket();
    const [files] = await bucket.getFiles({
      prefix,
      versions: false,
    });

    return files.map((file) => file.name);
  }

  async exists(objectName: string): Promise<boolean> {
    const bucket = await this.getBucket();
    const response = await bucket.file(objectName).exists();
    return response[0];
  }

  async uploadFromBytes(objectName: string, contents: [Buffer]): Promise<void> {
    const bucket = await this.getBucket();
    return bucket.file(objectName).save(contents);
  }

  async uploadFromText(objectName: string, contents: string): Promise<void> {
    const bucket = await this.getBucket();
    return bucket.file(objectName).save(contents);
  }

  async uploadFromFilename(
    objectName: string,
    srcFilename: string,
  ): Promise<void> {
    const bucket = await this.getBucket();
    await bucket.upload(srcFilename, {
      destination: objectName,
    });
  }

  async uploadFromStream(objectName: string, stream: Readable): Promise<void> {
    const bucket = await this.getBucket();

    return new Promise((resolve, reject) => {
      stream
        .pipe(bucket.file(objectName).createWriteStream({ resumable: false }))
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
