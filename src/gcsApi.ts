import { ApiError, File as GoogleFile } from '@google-cloud/storage';

import { RequestError, StorageObject } from './';
import { Err, ErrResult } from './result';

export function errFromGoogleErr(error: unknown): ErrResult<RequestError> {
  if (error instanceof ApiError) {
    return Err({
      message: error.message,
      statusCode: error.code,
    });
  } else if (error instanceof Error) {
    return Err({
      message: error.toString(),
    });
  }
  return Err({
    message: 'An unknown error occurred.',
  });
}

export function parseFile(file: GoogleFile): StorageObject {
  return {
    name: file.name,
  };
}
