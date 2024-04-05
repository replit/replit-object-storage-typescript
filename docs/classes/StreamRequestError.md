# Class: StreamRequestError

An error that may be surfaced when using a stream.

## Hierarchy

- `Error`

  ↳ **`StreamRequestError`**

## Constructors

### constructor

• **new StreamRequestError**(`err`): [`StreamRequestError`](StreamRequestError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`RequestError`](../interfaces/RequestError.md) |

#### Returns

[`StreamRequestError`](StreamRequestError.md)

#### Overrides

Error.constructor

#### Defined in

[index.ts:38](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/index.ts#L38)

## Properties

### requestError

• `Private` **requestError**: [`RequestError`](../interfaces/RequestError.md)

#### Defined in

[index.ts:36](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/index.ts#L36)

## Methods

### getRequestError

▸ **getRequestError**(): [`RequestError`](../interfaces/RequestError.md)

#### Returns

[`RequestError`](../interfaces/RequestError.md)

#### Defined in

[index.ts:48](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/index.ts#L48)
