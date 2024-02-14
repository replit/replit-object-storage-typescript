import { REPLIT_DEFAULT_BUCKET_URL } from './config';

export async function getDefaultBucketId(): Promise<string> {
  const response = await fetch(REPLIT_DEFAULT_BUCKET_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch default bucket, errorcode: ${response.status}, make sure you're running on Replit`,
    );
  }

  const defaultBucketResponse = await response.json();

  if (
    typeof defaultBucketResponse !== 'object' ||
    !defaultBucketResponse ||
    !('bucketId' in defaultBucketResponse) ||
    typeof defaultBucketResponse.bucketId !== 'string'
  ) {
    throw new Error(
      "Failed to fetch default bucket, make sure you're running on Replit",
    );
  }

  return defaultBucketResponse.bucketId;
}
