import type { Adapter } from './adapter.base'
import type { AdapterModule } from './types'

/**
 * Compile-time type safety helper for defining adapters.
 *
 * This curried function provides stronger compile-time guarantees by verifying:
 * 1. The class extends Adapter<TOptions> with the correct options type
 * 2. The register() method returns AdapterModule<TToken> with the correct token
 * 3. The registerAsync() method returns AdapterModule<TToken> with the correct token
 *
 * **This is an identity function** - it returns the class unchanged and has zero runtime cost.
 * Its purpose is purely compile-time type verification.
 *
 * @template TToken - The port token type this adapter provides
 * @template TOptions - The options type for configuring this adapter
 *
 * @returns A function that accepts the adapter class and returns it with augmented types
 *
 * @example
 * ```typescript
 * const STORAGE_TOKEN = Symbol('STORAGE_PROVIDER');
 *
 * interface S3Options {
 *   bucket: string;
 *   region: string;
 * }
 *
 * export default defineAdapter<typeof STORAGE_TOKEN, S3Options>()(
 *   @AdapterToken(STORAGE_TOKEN)
 *   @AdapterImpl(S3Service)
 *   class S3Adapter extends Adapter<S3Options> {
 *     protected imports(options: S3Options) {
 *       return [HttpModule];
 *     }
 *   }
 * );
 * ```
 */
export function defineAdapter<TToken, TOptions>() {
	return <T extends new () => Adapter<TOptions>>(
		adapterClass: T & {
			register(options: TOptions): AdapterModule<TToken>
			registerAsync(asyncOptions: {
				imports?: unknown[]
				inject?: unknown[]
				useFactory: (...args: unknown[]) => TOptions | Promise<TOptions>
			}): AdapterModule<TToken>
		},
	): T & {
		register(options: TOptions): AdapterModule<TToken>
		registerAsync(asyncOptions: {
			imports?: unknown[]
			inject?: unknown[]
			useFactory: (...args: unknown[]) => TOptions | Promise<TOptions>
		}): AdapterModule<TToken>
	} => {
		// Identity function - returns the class unchanged
		return adapterClass
	}
}
