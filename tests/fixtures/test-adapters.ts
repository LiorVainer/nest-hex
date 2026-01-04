import { Adapter, AdapterBase } from '../../src'
import {
	MockApiService,
	MockCacheService,
	MockStorageService,
} from './test-services'
import {
	TEST_API_TOKEN,
	TEST_CACHE_TOKEN,
	TEST_STORAGE_TOKEN,
} from './test-tokens'

/**
 * Mock adapter modules for testing.
 * These adapters use the @Adapter decorator pattern and can be used in tests.
 */

export type TestStorageConfigOptions = {
	prefix?: string
}

@Adapter({
	portToken: TEST_STORAGE_TOKEN,
	implementation: MockStorageService,
})
export class TestStorageAdapter extends AdapterBase<TestStorageConfigOptions> {}

export type TestApiConfigOptions = {
	baseUrl: string
	timeout?: number
}

@Adapter({
	portToken: TEST_API_TOKEN,
	implementation: MockApiService,
})
export class TestApiAdapter extends AdapterBase<TestApiConfigOptions> {}

export type TestCacheConfigOptions = {
	defaultTtl: number
}

@Adapter({
	portToken: TEST_CACHE_TOKEN,
	implementation: MockCacheService,
})
export class TestCacheAdapter extends AdapterBase<TestCacheConfigOptions> {}
