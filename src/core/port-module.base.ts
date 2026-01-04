import 'reflect-metadata'
import { type DynamicModule, Module } from '@nestjs/common'
import type { AdapterModule } from './types'

/**
 * Base class for building port modules following the Ports & Adapters pattern.
 *
 * Port modules expose domain services that consume ports (via adapters) through dependency injection.
 * This base class simplifies creating modules that accept and import adapter modules with type safety.
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
 * export class FileModule extends PortModule {}
 *
 * // TypeScript infers token type from the adapter:
 * FileModule.register({
 *   adapter: S3Adapter.register({ bucket: 'my-bucket' })
 * })
 * ```
 */
@Module({})
export class PortModule {
	/**
	 * Registers the port module with an adapter.
	 *
	 * @param config - Configuration object containing the adapter module
	 * @param config.adapter - An adapter module that provides a port implementation
	 * @returns A dynamic module that imports the adapter
	 */
	static register<TToken>(config: {
		adapter?: AdapterModule<TToken>
	}): DynamicModule {
		return {
			module: this,
			imports: config.adapter ? [config.adapter] : [],
		}
	}
}
