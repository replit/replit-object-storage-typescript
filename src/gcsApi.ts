import { ApiError, File as GoogleFile } from '@google-cloud/storage';

import { Err, ErrResult } from './result';

export interface File {
  name: string;
  generation?: number;
}

export function errFromGoogleErr(error: unknown): ErrResult<string> {
  // TODO: This needs better error handling
  if (error instanceof ApiError) {
    return Err('Google Error');
  }
  return Err('Unknown');
}

export function parseFile(file: GoogleFile): File {
  return {
    generation: file.generation,
    name: file.name,
  };
}
