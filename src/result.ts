/**
 * A Result type that can be used to represent a successful value or an error.
 * It forces the consumer to check whether the returned type is an error or not,
 * `result.ok` acts as a discriminant between success and failure
 * @public
 * @typeParam T - The type of the result's value.
 * @typeParam E - The type of the result's error.
 * @typeParam ErrorExtras - The type of additional error info, if any will be returned.
 */
export type Result<T, E = Error | string, ErrorExtras = unknown> =
  | OkResult<T>
  | ErrResult<E, ErrorExtras>;

/**
 * Represents a successful result
 * @public
 * @typeParam T - The type of the result's value.
 */
export interface OkResult<T> {
  /**
   * Indicates that the request was successful.
   */
  ok: true;
  /**
   * The value returned by the request.
   */
  value: T;
  /**
   * Always undefined when the request was successful.
   */
  error?: undefined;
}

/**
 * Represents a failure result
 * @public
 * @typeParam E - The type of the error.
 * @typeParam ErrorExtras - The type of any additional information on the error, if provided.
 */
export interface ErrResult<E, ErrorExtras = unknown> {
  /**
   * Indicates that the request was unsuccessful.
   */
  ok: false;
  /**
   * The error that occurred.
   */
  error: E;
  /**
   * Always undefined when the request was successful.
   */
  value?: undefined;
  /**
   * Additional information on the error, if applicable.
   */
  errorExtras?: ErrorExtras;
}

/**
 * A helper function to create an error Result type
 */
export function Err<E, ErrorExtras>(
  error: E,
  errorExtras?: ErrorExtras,
): ErrResult<E, ErrorExtras> {
  return { ok: false, error, errorExtras };
}

/**
 * A helper function to create a successful Result type
 **/
export function Ok<T>(value: T): OkResult<T> {
  return { ok: true, value };
}
