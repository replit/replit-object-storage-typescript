# @replit/object-storage

## Classes

- [Client](classes/Client.md)
- [StreamRequestError](classes/StreamRequestError.md)

## Interfaces

- [ClientOptions](interfaces/ClientOptions.md)
- [DeleteOptions](interfaces/DeleteOptions.md)
- [DownloadOptions](interfaces/DownloadOptions.md)
- [ErrResult](interfaces/ErrResult.md)
- [ListOptions](interfaces/ListOptions.md)
- [OkResult](interfaces/OkResult.md)
- [RequestError](interfaces/RequestError.md)
- [StorageObject](interfaces/StorageObject.md)
- [UploadOptions](interfaces/UploadOptions.md)

## Type Aliases

### Result

Ƭ **Result**\<`T`, `E`, `ErrorExtras`\>: [`OkResult`](interfaces/OkResult.md)\<`T`\> \| [`ErrResult`](interfaces/ErrResult.md)\<`E`, `ErrorExtras`\>

A Result type that can be used to represent a successful value or an error.
It forces the consumer to check whether the returned type is an error or not,
`result.ok` acts as a discriminant between success and failure

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | `T` | The type of the result's value. |
| `E` | `Error` \| `string` | The type of the result's error. |
| `ErrorExtras` | `unknown` | The type of additional error info, if any will be returned. |

#### Defined in

[result.ts:10](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/result.ts#L10)
