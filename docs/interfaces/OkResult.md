# Interface: OkResult\<T\>

Represents a successful result

## Type parameters

| Name | Description |
| :------ | :------ |
| `T` | The type of the result's value. |

## Properties

### error

• `Optional` **error**: `undefined`

Always undefined when the request was successful.

#### Defined in

[result.ts:31](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/result.ts#L31)

___

### ok

• **ok**: ``true``

Indicates that the request was successful.

#### Defined in

[result.ts:23](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/result.ts#L23)

___

### value

• **value**: `T`

The value returned by the request.

#### Defined in

[result.ts:27](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/result.ts#L27)
