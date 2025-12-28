import { type DynamicModule, Module, type Type } from '@nestjs/common'
import type { AdapterModule } from './types'

/**
 * Abstract base class for building feature modules following the Ports & Adapters pattern.
 *
 * Feature modules expose domain services that consume adapters through dependency injection.
 * This base class simplifies creating feature modules that accept and import adapter modules.
 *
 * @template _TService - The service class provided by this feature module (used for type constraints)
 *
 * @example
 * ```typescript
 * const STORAGE_TOKEN = Symbol('STORAGE_PROVIDER');
 *
 * @Injectable()
 * class FileService {
 *   constructor(
 *     @InjectPort(STORAGE_TOKEN)
 *     private storage: StorageProvider,
 *   ) {}
 * }
 *
 * @Module({})
 * class FileModule extends FeatureModule<typeof FileService> {
 *   protected static service = FileService;
 * }
 *
 * // Usage:
 * FileModule.register({
 *   adapter: S3Adapter.register({ bucket: 'my-bucket' })
 * })
 * ```
 */
@Module({})
export abstract class FeatureModule<_TService> {
	/**
	 * The service class that this feature module provides.
	 * Must be set by the concrete feature module class.
	 */
	protected static service: Type<unknown>

	/**
	 * Registers the feature module with an adapter.
	 *
	 * @param config - Configuration object containing the adapter module
	 * @param config.adapter - An adapter module that provides the required token
	 * @returns A dynamic module that imports the adapter and provides the service
	 */
	static register<TToken>({
		adapter,
	}: {
		adapter: AdapterModule<TToken>
	}): DynamicModule {
		return {
			module: this as never,
			imports: [adapter],
			providers: [this.service],
			exports: [this.service],
		}
	}
}
