import 'reflect-metadata'
import { type DynamicModule, Module } from '@nestjs/common'

/**
 * Base class for building domain modules following the Ports & Adapters pattern.
 *
 * Domain modules expose domain services that consume ports (via adapters) through dependency injection.
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
 * export class FileModule extends DomainModule {}
 *
 * // TypeScript infers token type from the adapter:
 * FileModule.register({
 *   adapter: S3Adapter.register({ bucket: 'my-bucket' })
 * })
 * ```
 */
@Module({})
export class DomainModule {
	/**
	 * Registers the domain module with an adapter.
	 *
	 * @param config - Configuration object containing the adapter module
	 * @param config.adapter - An adapter module that provides a port implementation
	 * @returns A dynamic module that imports the adapter
	 */
	static register(config: { adapter?: DynamicModule }): DynamicModule {
		return {
			module: DomainModule,
			imports: config.adapter ? [config.adapter] : [],
		}
	}
}
