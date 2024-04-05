# Interface: ErrResult\<E, ErrorExtras\>

Represents a failure result

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `E` | `E` | The type of the error. |
| `ErrorExtras` | `unknown` | The type of any additional information on the error, if provided. |

## Properties

### error

• **error**: `E`

The error that occurred.

#### Defined in

[result.ts:48](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/result.ts#L48)

___

### errorExtras

• `Optional` **errorExtras**: `ErrorExtras`

Additional information on the error, if applicable.

#### Defined in

[result.ts:56](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/result.ts#L56)

___

### ok

• **ok**: ``false``

Indicates that the request was unsuccessful.

#### Defined in

[result.ts:44](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/result.ts#L44)

___

### value

• `Optional` **value**: `undefined`

Always undefined when the request was successful.

#### Defined in

[result.ts:52](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/result.ts#L52)
