/**
 * S3 Object Storage Adapter
 *
 * This adapter provides object storage capabilities using AWS S3.
 * It uses the decorator-driven API for minimal boilerplate.
 *
 * Key Points:
 * - Extends AdapterBase<S3ConfigOptions>
 * - Uses @Port to declare the token and implementation
 * - Provides compile-time type safety through static methods
 */

import { Adapter, AdapterBase } from '../../../../src'
import { OBJECT_STORAGE_TOKEN } from '../../object-storage.token'
import { S3ObjectStorageService } from './s3.service'
import type { S3AdapterConfig, S3ConfigOptions } from './s3.types'

/**
 * S3 adapter for object storage.
 *
 * This adapter implements the object storage port using AWS S3.
 *
 * Usage Example (Synchronous):
 * ```typescript
 * S3Adapter.register({
 *   bucket: 'my-app-uploads',
 *   region: 'us-east-1',
 *   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 *   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
 *   defaultAcl: 'public-read'
 * })
 * ```
 *
 * Usage Example (Asynchronous with DI):
 * ```typescript
 * S3Adapter.registerAsync({
 *   imports: [ConfigModule],
 *   inject: [ConfigService],
 *   useFactory: (config: ConfigService) => ({
 *     bucket: config.get('S3_BUCKET'),
 *     region: config.get('AWS_REGION'),
 *     accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
 *     secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
 *     defaultAcl: 'public-read'
 *   })
 * })
 * ```
 */
@Adapter<S3AdapterConfig>({
	portToken: OBJECT_STORAGE_TOKEN,
	implementation: S3ObjectStorageService,
})
export class S3Adapter extends AdapterBase<S3ConfigOptions> {
	// No additional code needed!
	// The decorators and base class handle everything:
	// - Token registration
	// - Implementation provider
	// - Export configuration
	// - Type safety
	/**
	 * Optional: Override imports() to add module dependencies.
	 *
	 * Uncomment this if your S3 service needs HttpModule or other modules:
	 */
	// protected override imports(options: S3ConfigOptions): unknown[] {
	//   return [HttpModule];
	// }
	/**
	 * Optional: Override extraProviders() to add helper services.
	 *
	 * Uncomment this if you need additional providers:
	 */
	// protected override extraProviders(options: S3ConfigOptions): Provider[] {
	//   return [
	//     {
	//       provide: 'S3_CLIENT_FACTORY',
	//       useFactory: () => new S3Client({ region: options.region })
	//     }
	//   ];
	// }
}

export default S3Adapter

/**
 * What This Adapter Provides:
 *
 * When you call S3Adapter.register(options), you get a DynamicModule:
 *
 * {
 *   module: S3Adapter,
 *   imports: [],
 *   providers: [
 *     S3ObjectStorageService,  // The implementation
 *     {
 *       provide: OBJECT_STORAGE_TOKEN,  // The port token
 *       useExisting: S3ObjectStorageService  // Alias to implementation
 *     }
 *   ],
 *   exports: [OBJECT_STORAGE_TOKEN]  // Export the token
 * }
 *
 * Any service that injects OBJECT_STORAGE_TOKEN will receive an instance
 * of S3ObjectStorageService.
 */

/**
 * Alternative Adapters:
 *
 * You can easily create alternative implementations:
 *
 * - AzureBlobAdapter - Uses Azure Blob Storage
 * - GoogleCloudStorageAdapter - Uses GCS
 * - MinIOAdapter - Uses MinIO (self-hosted S3-compatible)
 * - FilesystemAdapter - Uses local filesystem (for development)
 *
 * All adapters implement the same ObjectStoragePort interface and
 * provide the same OBJECT_STORAGE_TOKEN token, making them fully
 * interchangeable at the app module level.
 */
