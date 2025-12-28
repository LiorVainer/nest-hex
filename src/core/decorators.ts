import 'reflect-metadata'
import type { Type } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { ADAPTER_IMPL_METADATA, ADAPTER_TOKEN_METADATA } from './constants'

/**
 * Declares which port token the adapter provides.
 *
 * This decorator stores the token in class metadata, which is read at runtime
 * by the Adapter base class's register() and registerAsync() methods.
 *
 * @param token - The port token this adapter provides
 *
 * @example
 * ```typescript
 * @AdapterToken(OBJECT_STORAGE_PROVIDER)
 * @AdapterImpl(S3Service)
 * class S3Adapter extends Adapter<S3Options> {}
 * ```
 */
export function AdapterToken<TToken>(token: TToken): ClassDecorator {
	return (target: unknown) => {
		Reflect.defineMetadata(ADAPTER_TOKEN_METADATA, token, target as object)
	}
}

/**
 * Declares the concrete implementation class used by the adapter.
 *
 * This decorator stores the implementation class in class metadata, which is read
 * at runtime by the Adapter base class's register() and registerAsync() methods.
 *
 * @param implementation - The concrete implementation class that provides the port functionality
 *
 * @example
 * ```typescript
 * @AdapterToken(OBJECT_STORAGE_PROVIDER)
 * @AdapterImpl(S3ObjectStorageService)
 * class S3Adapter extends Adapter<S3Options> {}
 * ```
 */
export function AdapterImpl(implementation: Type<unknown>): ClassDecorator {
	return (target: unknown) => {
		Reflect.defineMetadata(
			ADAPTER_IMPL_METADATA,
			implementation,
			target as object,
		)
	}
}

/**
 * DX decorator for injecting a port token into service constructors.
 * This is a shorthand for @Inject(token) that provides clearer semantics.
 *
 * @param token - The port token to inject
 *
 * @example
 * ```typescript
 * @Injectable()
 * class ObjectStorageService {
 *   constructor(
 *     @InjectPort(OBJECT_STORAGE_PROVIDER)
 *     private readonly storage: ObjectStorageProvider,
 *   ) {}
 * }
 * ```
 */
export function InjectPort<TToken>(token: TToken): ParameterDecorator {
	return Inject(token as never)
}
