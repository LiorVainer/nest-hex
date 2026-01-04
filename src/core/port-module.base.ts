import 'reflect-metadata'
import { type DynamicModule, Module } from '@nestjs/common'
import type { AdapterModule } from './types'

/**
 * Abstract base class for building port modules following the Ports & Adapters pattern.
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
 * // Usage - TypeScript infers token type from the adapter:
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
	 * Uses the same type safety pattern as AdapterBase.register:
	 * - TypeScript infers TToken from the adapter module you pass in
	 * - Ensures type safety through the AdapterModule<TToken> structural type
	 *
	 * @param config - Configuration object containing the adapter module
	 * @param config.adapter - An adapter module that provides the required port token
	 * @returns A dynamic module that imports the adapter and provides the service
	 */
	static register<TToken>({
		adapter,
	}: {
		adapter?: AdapterModule<TToken>
	}): DynamicModule {
		return {
			module: this,
			imports: adapter ? [adapter] : [],
		}
	}
}
