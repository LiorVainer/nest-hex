import { describe, expect, it } from 'bun:test'
import 'reflect-metadata'
import { DomainModule } from '../../src'
import { TestStorageAdapter } from '../fixtures/test-adapters'

describe('DomainModule.register()', () => {
	it('should return a DynamicModule with correct structure', () => {
		const module = DomainModule.register({
			adapter: TestStorageAdapter.register({ prefix: 'test-' }),
		})

		expect(module).toBeDefined()
		expect(module.module).toBe(DomainModule)
		expect(module.imports).toBeDefined()
	})

	it('should import the provided adapter module', () => {
		const adapterModule = TestStorageAdapter.register({ prefix: 'test-' })
		const module = DomainModule.register({ adapter: adapterModule })

		expect(module.imports).toContain(adapterModule)
	})

	it('should work without an adapter', () => {
		const module = DomainModule.register({})

		expect(module).toBeDefined()
		expect(module.module).toBe(DomainModule)
		expect(module.imports).toEqual([])
	})

	it('should accept undefined adapter', () => {
		const module = DomainModule.register({ adapter: undefined })

		expect(module).toBeDefined()
		expect(module.imports).toEqual([])
	})

	it('should be extensible by domain modules', () => {
		// Test that DomainModule can be extended by custom modules
		class CustomDomainModule extends DomainModule {}

		const module = CustomDomainModule.register({
			adapter: TestStorageAdapter.register({ prefix: 'custom-' }),
		})

		expect(module).toBeDefined()
		expect(module.module).toBe(DomainModule) // Still references base DomainModule
	})
})
