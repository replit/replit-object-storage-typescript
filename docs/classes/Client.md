# Class: Client

Class representing a client to communicate with Object Storage from Replit.

## Constructors

### constructor

• **new Client**(`options?`): [`Client`](Client.md)

Creates a new client.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`ClientOptions`](../interfaces/ClientOptions.md) | configurations to setup the client. |

#### Returns

[`Client`](Client.md)

#### Defined in

[client.ts:120](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L120)

## Methods

### copy

▸ **copy**(`objectName`, `destObjectName`): `Promise`\<[`Result`](../modules.md#result)\<``null``, [`RequestError`](../interfaces/RequestError.md)\>\>

Copies the specified object within the same bucket.
If an object exists in the same location, it will be overwritten.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `objectName` | `string` | The full path of the object to copy. |
| `destObjectName` | `string` | The full path to copy the object to. |

#### Returns

`Promise`\<[`Result`](../modules.md#result)\<``null``, [`RequestError`](../interfaces/RequestError.md)\>\>

#### Defined in

[client.ts:184](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L184)

___

### delete

▸ **delete**(`objectName`, `options?`): `Promise`\<[`Result`](../modules.md#result)\<``null``, [`RequestError`](../interfaces/RequestError.md)\>\>

Deletes the specified object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `objectName` | `string` | The full path of the object to delete. |
| `options?` | [`DeleteOptions`](../interfaces/DeleteOptions.md) | Configurations for the delete operation. |

#### Returns

`Promise`\<[`Result`](../modules.md#result)\<``null``, [`RequestError`](../interfaces/RequestError.md)\>\>

#### Defined in

[client.ts:202](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L202)

___

### downloadAsBytes

▸ **downloadAsBytes**(`objectName`, `options?`): `Promise`\<[`Result`](../modules.md#result)\<[`Buffer`], [`RequestError`](../interfaces/RequestError.md)\>\>

Downloads an object as a buffer containing the object's raw contents.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `objectName` | `string` | The full path of the object to download. |
| `options?` | [`DownloadOptions`](../interfaces/DownloadOptions.md) | Configurations for the download operation. |

#### Returns

`Promise`\<[`Result`](../modules.md#result)\<[`Buffer`], [`RequestError`](../interfaces/RequestError.md)\>\>

#### Defined in

[client.ts:220](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L220)

___

### downloadAsStream

▸ **downloadAsStream**(`objectName`, `options?`): `Readable`

Opens a new stream and streams the object's contents.
If an error is encountered, it will be emitted through the stream.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `objectName` | `string` | The full path of the object to download. |
| `options?` | [`DownloadOptions`](../interfaces/DownloadOptions.md) | Configurations for the download operation. |

#### Returns

`Readable`

#### Defined in

[client.ts:283](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L283)

___

### downloadAsText

▸ **downloadAsText**(`objectName`, `options?`): `Promise`\<[`Result`](../modules.md#result)\<`string`, [`RequestError`](../interfaces/RequestError.md)\>\>

Downloads a object to a string and returns the string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `objectName` | `string` | The full path of the object to download. |
| `options?` | [`DownloadOptions`](../interfaces/DownloadOptions.md) | Configurations for the download operation. |

#### Returns

`Promise`\<[`Result`](../modules.md#result)\<`string`, [`RequestError`](../interfaces/RequestError.md)\>\>

#### Defined in

[client.ts:238](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L238)

___

### downloadToFilename

▸ **downloadToFilename**(`objectName`, `destFilename`, `options?`): `Promise`\<[`Result`](../modules.md#result)\<``null``, [`RequestError`](../interfaces/RequestError.md)\>\>

Downloads an object to the local filesystem.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `objectName` | `string` | The full path of the object to download. |
| `destFilename` | `string` | The path on the local filesystem to write the downloaded object to. |
| `options?` | [`DownloadOptions`](../interfaces/DownloadOptions.md) | Configurations for the download operation. |

#### Returns

`Promise`\<[`Result`](../modules.md#result)\<``null``, [`RequestError`](../interfaces/RequestError.md)\>\>

#### Defined in

[client.ts:258](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L258)

___

### exists

▸ **exists**(`objectName`): `Promise`\<[`Result`](../modules.md#result)\<`boolean`, [`RequestError`](../interfaces/RequestError.md)\>\>

Checks whether the given object exists.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `objectName` | `string` | The full path of the object to check. |

#### Returns

`Promise`\<[`Result`](../modules.md#result)\<`boolean`, [`RequestError`](../interfaces/RequestError.md)\>\>

#### Defined in

[client.ts:309](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L309)

___

### getBucket

▸ **getBucket**(): `Promise`\<`Bucket`\>

#### Returns

`Promise`\<`Bucket`\>

#### Defined in

[client.ts:155](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L155)

___

### init

▸ **init**(`bucketId?`): `Promise`\<`Bucket`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `bucketId?` | `string` |

#### Returns

`Promise`\<`Bucket`\>

#### Defined in

[client.ts:127](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L127)

___

### list

▸ **list**(`options?`): `Promise`\<[`Result`](../modules.md#result)\<[`StorageObject`](../interfaces/StorageObject.md)[], [`RequestError`](../interfaces/RequestError.md)\>\>

Lists objects in the bucket.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`ListOptions`](../interfaces/ListOptions.md) | Configurations for the list operation. |

#### Returns

`Promise`\<[`Result`](../modules.md#result)\<[`StorageObject`](../interfaces/StorageObject.md)[], [`RequestError`](../interfaces/RequestError.md)\>\>

#### Defined in

[client.ts:323](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L323)

___

### mapUploadOptions

▸ **mapUploadOptions**(`options?`): `undefined` \| `UploadOptions`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`UploadOptions`](../interfaces/UploadOptions.md) |

#### Returns

`undefined` \| `UploadOptions`

#### Defined in

[client.ts:167](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L167)

___

### uploadFromBytes

▸ **uploadFromBytes**(`objectName`, `contents`, `options?`): `Promise`\<[`Result`](../modules.md#result)\<``null``, [`RequestError`](../interfaces/RequestError.md)\>\>

Uploads an object from its in-memory byte representation.
If an object already exists with the specified name it will be overwritten.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `objectName` | `string` | The full destination path of the object. |
| `contents` | `Buffer` | The raw contents of the object in byte form. |
| `options?` | [`UploadOptions`](../interfaces/UploadOptions.md) | Configurations for the upload operation. |

#### Returns

`Promise`\<[`Result`](../modules.md#result)\<``null``, [`RequestError`](../interfaces/RequestError.md)\>\>

#### Defined in

[client.ts:347](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L347)

___

### uploadFromFilename

▸ **uploadFromFilename**(`objectName`, `srcFilename`, `options?`): `Promise`\<[`Result`](../modules.md#result)\<``null``, [`RequestError`](../interfaces/RequestError.md)\>\>

Uploads an object from a file on the local filesystem.
If an object already exists with the specified name it will be overwritten.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `objectName` | `string` | The full destination path of the object. |
| `srcFilename` | `string` | The path of the file on the local filesystem to upload. |
| `options?` | [`UploadOptions`](../interfaces/UploadOptions.md) | Configurations for the upload operation. |

#### Returns

`Promise`\<[`Result`](../modules.md#result)\<``null``, [`RequestError`](../interfaces/RequestError.md)\>\>

#### Defined in

[client.ts:391](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L391)

___

### uploadFromStream

▸ **uploadFromStream**(`objectName`, `stream`, `options?`): `Promise`\<`void`\>

Uploads an object by streaming its contents from the provided stream.
If an error is encountered, it will be emitted through the stream. If an object already exists with the specified name it will be overwritten.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `objectName` | `string` | The full destination path of the object. |
| `stream` | `Readable` | A writeable stream the object will be written from. |
| `options?` | [`UploadOptions`](../interfaces/UploadOptions.md) | Configurations for the upload operation. |

#### Returns

`Promise`\<`void`\>

#### Defined in

[client.ts:416](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L416)

___

### uploadFromText

▸ **uploadFromText**(`objectName`, `contents`, `options?`): `Promise`\<[`Result`](../modules.md#result)\<``null``, [`RequestError`](../interfaces/RequestError.md)\>\>

Uploads an object from its in-memory text representation.
If an object already exists with the specified name it will be overwritten.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `objectName` | `string` | The full destination path of the object. |
| `contents` | `string` | The contents of the object in text form. |
| `options?` | [`UploadOptions`](../interfaces/UploadOptions.md) | Configurations for the upload operation. |

#### Returns

`Promise`\<[`Result`](../modules.md#result)\<``null``, [`RequestError`](../interfaces/RequestError.md)\>\>

#### Defined in

[client.ts:369](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L369)
