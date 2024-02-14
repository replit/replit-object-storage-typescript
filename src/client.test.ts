import { expect, test } from 'vitest';
import { Client } from './client';

test('lists', async () => {
  const client = new Client("replit-objstore-49d0cbd2-063c-418a-87e5-fd3298c820ce");

  const response = await client.list('');

  console.log(response);

  expect(response).toBeTruthy();
})