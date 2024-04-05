# Interface: ListOptions

Configuration options for listing objects in a bucket.

## Properties

### endOffset

• `Optional` **endOffset**: `string`

Filter results to objects whose names are
lexicographically before endOffset. If startOffset is also set, the objects
listed have names between startOffset (inclusive) and endOffset (exclusive).

#### Defined in

[client.ts:61](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L61)

___

### matchGlob

• `Optional` **matchGlob**: `string`

Glob pattern used to filter results, for example foo*bar.

#### Defined in

[client.ts:65](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L65)

___

### maxResults

• `Optional` **maxResults**: `number`

The maximum number of results that can be returned in the response.

#### Defined in

[client.ts:69](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L69)

___

### prefix

• `Optional` **prefix**: `string`

Filter results to objects who names have the specified prefix.

#### Defined in

[client.ts:73](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L73)

___

### startOffset

• `Optional` **startOffset**: `string`

Filter results to objects whose names are
lexicographically equal to or after startOffset. If endOffset is also set,
the objects listed have names between startOffset (inclusive) and endOffset (exclusive).

#### Defined in

[client.ts:79](https://github.com/replit/replit-storage-typescript/blob/1e27272/src/client.ts#L79)
