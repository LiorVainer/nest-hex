import 'reflect-metadata'
import { type DynamicModule, Module } from '@nestjs/common'
import type { AdapterModule } from './types'

/**
 * Constructor type for PortModule subclasses.
 * Used in the `this` parameter to capture the token type from the class definition.
 */
export type PortModuleCtor<TToken> = new (...args: any[]) => PortModule<TToken>

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
 * type StorageToken = typeof STORAGE_TOKEN;
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
 * export class FileModule extends PortModule<StorageToken> {}
 *
 * // TypeScript ensures adapter provides StorageToken:
 * FileModule.register({
 *   adapter: S3Adapter.register({ bucket: 'my-bucket' })
 * })
 * ```
 */
@Module({})
// biome-ignore lint/correctness/noUnusedVariables: TToken is captured by PortModuleCtor in register()
export class PortModule<TToken = unknown> {
	static register<TToken>(
		this: PortModuleCtor<TToken>,
		config: { adapter?: AdapterModule<TToken> },
	): DynamicModule {
		return {
			module: this,
			imports: config.adapter ? [config.adapter] : [],
		}
	}
}
