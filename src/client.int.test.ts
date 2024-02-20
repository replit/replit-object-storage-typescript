import * as fs from 'fs';
import { PassThrough } from 'stream';

import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { Client } from './client';

let client: Client;
const testDir = crypto.randomUUID();
const testFileContents = 'Hello World!';

const getLocalTestDir = () =>
  new Promise<string>((resolve) => {
    fs.mkdtemp(`${process.cwd()}/tmp`, (err, tmpDir) => {
      if (err) throw err;
      resolve(tmpDir);
    });
  });

beforeAll(() => {
  client = new Client();
});

describe('copy', () => {
  test('upload then copy', async () => {
    const objectName1 = `${testDir}/copy-1.txt`;
    const objectName2 = `${testDir}/copy-2.txt`;
    await client.uploadFromText(objectName1, testFileContents);
    const initialUploadSuccess = await client.exists(objectName1);
    expect(initialUploadSuccess).toBeTruthy();

    const { ok, value } = await client.copy(objectName1, objectName2);
    expect(ok).toBeTruthy();
    expect(value).toBeNull();

    const copySuccess = await client.exists(objectName2);
    expect(copySuccess).toBeTruthy();
  });

  test('does not exist', async () => {
    try {
      await client.copy('bad-object-1', 'should-never-happen');
    } catch (error) {
      expect(error.code).toBe(404);
    }
  });
});

describe('delete', () => {
  test('upload then delete', async () => {
    const objectName = `${testDir}/delete-1.txt`;
    await client.uploadFromText(objectName, testFileContents);
    const initialUploadSuccess = await client.exists(objectName);
    expect(initialUploadSuccess).toBeTruthy();

    const deleteResult = await client.delete(objectName);
    expect(deleteResult.ok).toBeTruthy();
    expect(deleteResult.value).toBeNull();

    const existsResult = await client.exists(objectName);
    expect(existsResult.ok).toBeTruthy();
    expect(existsResult.value).toBeFalsy();
  });
});

describe('downloadAsBytes', () => {
  test('upload then download', async () => {
    const objectName = `${testDir}/download-as-bytes-1.txt`;
    await client.uploadFromText(objectName, testFileContents);

    const { ok, value: buffer } = await client.downloadAsBytes(objectName);
    expect(ok).toBeTruthy();
    expect(buffer.toString()).toBe(testFileContents);
  });
});

describe('downloadAsText', () => {
  test('upload then download', async () => {
    const objectName = `${testDir}/download-as-text-1.txt`;
    await client.uploadFromText(objectName, testFileContents);

    const { ok, value: text } = await client.downloadAsText(objectName);
    expect(ok).toBeTruthy();
    expect(text).toBe(testFileContents);
  });
});

describe('downloadToFilename', () => {
  test('upload then download', async () => {
    const localTestDir = await getLocalTestDir();

    const objectName = `${testDir}/download-to-filename-1.txt`;
    await client.uploadFromText(objectName, testFileContents);

    const filename = `${localTestDir}/download-to-filename-1.txt`;
    const result = await client.downloadToFilename(objectName, filename);
    expect(result.ok).toBeTruthy();

    const contents = fs.readFileSync(filename);
    expect(contents.toString()).toBe(testFileContents);

    fs.rmdirSync(localTestDir, { recursive: true });
  });
});

describe('downloadAsStream', () => {
  test('upload then download', async () => {
    const objectName = `${testDir}/download-as-stream-1.txt`;
    await client.uploadFromText(objectName, testFileContents);

    let contents = '';
    const { ok, value: stream } = client.downloadAsStream(objectName);
    expect(ok).toBeTruthy();
    await stream.forEach((chunk: string) => {
      contents += chunk.toString();
    });
    expect(contents).toBe(testFileContents);
  });
});

describe('exists', () => {
  test('does not exist', async () => {
    const { ok, value: exists } = await client.exists(
      `${testDir}/exists-1.txt`,
    );
    expect(ok).toBeTruthy();
    expect(exists).toBeFalsy();
  });

  test('does exist', async () => {
    const objectName = `${testDir}/exists-2.txt`;
    await client.uploadFromText(objectName, testFileContents);

    const { ok, value: exists } = await client.exists(objectName);
    expect(ok).toBeTruthy();
    expect(exists).toBeTruthy();
  });
});

describe('list', () => {
  test('upload multiple then list', async () => {
    const objectName1 = `${testDir}/list/list1-1.txt`;
    const objectName2 = `${testDir}/list/list1-2.txt`;
    await client.uploadFromText(objectName1, testFileContents);
    await client.uploadFromText(objectName2, testFileContents);

    const { ok, value: files } = await client.list({
      prefix: `${testDir}/list`,
    });
    expect(ok).toBeTruthy();
    expect(files).toEqual([{ name: objectName1 }, { name: objectName2 }]);
  });
});

describe('uploadFromBytes', () => {
  test('upload then download', async () => {
    const objectName = `${testDir}/upload-from-bytes-1.txt`;
    const { ok, value } = await client.uploadFromBytes(
      objectName,
      Buffer.from(testFileContents),
    );
    expect(ok).toBeTruthy();
    expect(value).toBeNull();

    const { value: output } = await client.downloadAsText(objectName);
    expect(output).toBe(testFileContents);
  });
});

describe('uploadFromText', () => {
  test('upload then download', async () => {
    const objectName = `${testDir}/upload-from-text-1.txt`;
    const { ok, value } = await client.uploadFromText(
      objectName,
      testFileContents,
    );
    expect(ok).toBeTruthy();
    expect(value).toBeNull();

    const { value: text } = await client.downloadAsText(objectName);
    expect(text).toBe(testFileContents);
  });
});

describe('uploadFromFilename', () => {
  test('upload then download', async () => {
    const localTestDir = await getLocalTestDir();
    const filename = `${localTestDir}/upload-from-filename-1.txt`;
    fs.writeFileSync(filename, testFileContents);

    const objectName = `${testDir}/upload-from-filename-1.txt`;
    const { ok, value } = await client.uploadFromFilename(objectName, filename);
    expect(ok).toBeTruthy();
    expect(value).toBeNull();

    const { value: text } = await client.downloadAsText(objectName);
    expect(text).toBe(testFileContents);

    fs.rmdirSync(localTestDir, { recursive: true });
  });
});

describe('uploadFromStream', () => {
  test('upload then download', async () => {
    const objectName = `${testDir}/upload-from-stream-1.txt`;

    const stream = new PassThrough();
    stream.end(testFileContents);
    await client.uploadFromStream(objectName, stream);

    const { value: text } = await client.downloadAsText(objectName);
    expect(text).toBe(testFileContents);
  });
});

afterAll(async () => {
  const { value: files } = await client.list();
  const deletions = files.map((file) => client.delete(file));
  await Promise.all(deletions);
});
