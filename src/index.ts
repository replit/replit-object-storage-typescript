import {
  Client,
  ClientOptions,
  DeleteOptions,
  DownloadOptions,
  ListOptions,
  UploadOptions,
} from './client';
import type { ErrResult, OkResult, Result } from './result';

/**
 * Metadata for an object.
 * @public
 */
export interface StorageObject {
  /**
   * The name of the object, including its full path.
   */
  name: string;
}

/**
 * An object that represents an error with a request
 * @public
 */
export interface RequestError {
  message: string;
  statusCode?: number;
}

/**
 * An error that may be surfaced when using a stream.
 * @public
 */
export class StreamRequestError extends Error {
  private requestError: RequestError;

  constructor(err: RequestError) {
    if (err.statusCode) {
      super(`${err.statusCode}: ${err.message}`);
    } else {
      super(err.message);
    }

    this.requestError = err;
  }

  getRequestError(): RequestError {
    return this.requestError;
  }
}

export { Client, ErrResult, OkResult, Result };
export type {
  ClientOptions,
  DeleteOptions,
  DownloadOptions,
  ListOptions,
  UploadOptions,
};
