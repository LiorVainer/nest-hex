import 'reflect-metadata'
import { type DynamicModule, Module } from '@nestjs/common'
import type { AdapterModule } from './types'

/**
 * Abstract base class for building port modules following the Ports & Adapters pattern.
 *
 * Port modules expose domain services that consume ports (via adapters) through dependency injection.
 * This base class simplifies creating modules that accept and import adapter modules with type safety.
 *
 * @template TToken - The port token type this module requires
 *
 * @example
 * ```typescript
 * const STORAGE_TOKEN = Symbol('STORAGE_PORT');
 *
 * @Injectable()
 * class FileService {
 *   constructor(
 *     @InjectPort(STORAGE_TOKEN)
 *     private storage: StoragePort,
 *   ) {}
 * }
 *
 * @Module({})
 * export class FileModule extends PortModule<typeof STORAGE_TOKEN> {}
 *
 * // Usage - TypeScript ensures adapter provides STORAGE_TOKEN:
 * FileModule.register({
 *   adapter: S3Adapter.register({ bucket: 'my-bucket' })
 * })
 * ```
 */
@Module({})
// biome-ignore lint/correctness/noUnusedVariables: TToken is used via the this parameter trick in register()
export class PortModule<TToken = unknown> {
	/**
	 * Registers the port module with an adapter.
	 *
	 * Uses the same type safety trick as AdapterBase.register:
	 * - The `this` parameter binds the method to the specific subclass
	 * - TypeScript infers TToken from the class definition
	 * - Ensures the adapter provides the correct port token at compile-time
	 *
	 * @param config - Configuration object containing the adapter module
	 * @param config.adapter - An adapter module that provides the required port token
	 * @returns A dynamic module that imports the adapter and provides the service
	 */
	static register<T>(
		this: new () => PortModule<T>,
		{ adapter }: { adapter?: AdapterModule<T> },
	): DynamicModule {
		return {
			module: this,
			imports: adapter ? [adapter] : [],
		}
	}
}
