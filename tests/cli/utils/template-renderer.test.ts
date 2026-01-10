import { describe, expect, test, beforeEach, afterEach } from 'bun:test'
import { join } from 'node:path'
import {
	renderTemplate,
	renderTemplateString,
} from '../../../src/cli/utils/template-renderer'
import type { TemplateContext } from '../../../src/cli/types'
import { createTempDir } from '../helpers'
import { writeFile } from '../../../src/cli/utils/file-writer'

/**
 * Unit tests for template rendering utilities.
 * These utilities use Handlebars to render code templates with context.
 */
describe('Template Renderer Utilities', () => {
	const tempDir = createTempDir()
	let testDir: string

	beforeEach(async () => {
		testDir = await tempDir.create()
	})

	afterEach(async () => {
		await tempDir.cleanupAll()
	})

	describe('renderTemplateString', () => {
		test('renders simple template with variables', async () => {
			const template = 'Hello, {{name}}!'
			const context = { name: 'World' } as unknown as TemplateContext

			const result = await renderTemplateString(template, context)

			expect(result).toBe('Hello, World!')
		})

		test('renders template with multiple variables', async () => {
			const template = '{{greeting}}, {{name}}! You are {{age}} years old.'
			const context = {
				greeting: 'Hello',
				name: 'Alice',
				age: 30,
			} as unknown as TemplateContext

			const result = await renderTemplateString(template, context)

			expect(result).toBe('Hello, Alice! You are 30 years old.')
		})

		test('handles undefined variables gracefully', async () => {
			const template = 'Hello, {{undefinedVar}}!'
			const context = {} as unknown as TemplateContext

			const result = await renderTemplateString(template, context)

			expect(result).toBe('Hello, !')
		})

		test('renders conditional blocks with #if', async () => {
			const template = '{{#if showGreeting}}Hello, {{name}}!{{/if}}'
			const context1 = { showGreeting: true, name: 'World' } as unknown as TemplateContext
			const context2 = { showGreeting: false, name: 'World' } as unknown as TemplateContext

			const result1 = await renderTemplateString(template, context1)
			const result2 = await renderTemplateString(template, context2)

			expect(result1).toBe('Hello, World!')
			expect(result2).toBe('')
		})

		test('renders #if-else blocks', async () => {
			const template = '{{#if isAdmin}}Admin{{else}}User{{/if}}'
			const context1 = { isAdmin: true } as unknown as TemplateContext
			const context2 = { isAdmin: false } as unknown as TemplateContext

			const result1 = await renderTemplateString(template, context1)
			const result2 = await renderTemplateString(template, context2)

			expect(result1).toBe('Admin')
			expect(result2).toBe('User')
		})

		test('renders #each loops', async () => {
			const template = '{{#each items}}{{this}},{{/each}}'
			const context = { items: ['a', 'b', 'c'] } as unknown as TemplateContext

			const result = await renderTemplateString(template, context)

			expect(result).toBe('a,b,c,')
		})

		test('throws error for invalid template syntax', async () => {
			const template = '{{#if unclosed}}'
			const context = {} as unknown as TemplateContext

			await expect(renderTemplateString(template, context)).rejects.toThrow()
		})

		test('handles complex nested structures', async () => {
			const template = '{{user.name}} ({{user.email}})'
			const context = {
				user: {
					name: 'John',
					email: 'john@example.com',
				},
			} as unknown as TemplateContext

			const result = await renderTemplateString(template, context)

			expect(result).toBe('John (john@example.com)')
		})
	})

	describe('renderTemplate from file', () => {
		test('renders template from file with context', async () => {
			const templatePath = join(testDir, 'simple.hbs')
			await writeFile(templatePath, 'Hello, {{name}}!')

			const context = { name: 'World' } as unknown as TemplateContext
			const result = await renderTemplate(templatePath, context)

			expect(result).toBe('Hello, World!')
		})

		test('renders multiline template correctly', async () => {
			const templatePath = join(testDir, 'multiline.hbs')
			const templateContent = `export const {{nameScreamingSnake}} = Symbol('{{nameScreamingSnake}}')
export type {{namePascal}}Token = typeof {{nameScreamingSnake}}`

			await writeFile(templatePath, templateContent)

			const context = {
				nameScreamingSnake: 'OBJECT_STORAGE_PORT',
				namePascal: 'ObjectStorage',
			} as TemplateContext

			const result = await renderTemplate(templatePath, context)

			expect(result).toContain("export const OBJECT_STORAGE_PORT = Symbol('OBJECT_STORAGE_PORT')")
			expect(result).toContain('export type ObjectStorageToken = typeof OBJECT_STORAGE_PORT')
		})

		test('throws error for non-existent template file', async () => {
			const templatePath = join(testDir, 'nonexistent.hbs')
			const context = {} as unknown as TemplateContext

			await expect(renderTemplate(templatePath, context)).rejects.toThrow(
				/Template file not found/,
			)
		})

		test('throws error for invalid template syntax in file', async () => {
			const templatePath = join(testDir, 'invalid.hbs')
			await writeFile(templatePath, '{{#if unclosed}}')

			const context = {} as unknown as TemplateContext

			await expect(renderTemplate(templatePath, context)).rejects.toThrow(
				/Failed to compile template/,
			)
		})
	})

	describe('context with name variations', () => {
		test('all name variations are accessible in template', async () => {
			const template = `kebab: {{nameKebab}}
camel: {{nameCamel}}
pascal: {{namePascal}}
snake: {{nameSnake}}
screamingSnake: {{nameScreamingSnake}}`

			const context = {
				nameKebab: 'object-storage',
				nameCamel: 'objectStorage',
				namePascal: 'ObjectStorage',
				nameSnake: 'object_storage',
				nameScreamingSnake: 'OBJECT_STORAGE',
			} as TemplateContext

			const result = await renderTemplateString(template, context)

			expect(result).toContain('kebab: object-storage')
			expect(result).toContain('camel: objectStorage')
			expect(result).toContain('pascal: ObjectStorage')
			expect(result).toContain('snake: object_storage')
			expect(result).toContain('screamingSnake: OBJECT_STORAGE')
		})

		test('configuration options are accessible in template', async () => {
			const template = `portSuffix: {{portSuffix}}
adapterSuffix: {{adapterSuffix}}
fileCase: {{fileCase}}
indent: {{indent}}
quotes: {{quotes}}
semicolons: {{semicolons}}`

			const context = {
				portSuffix: 'PORT',
				adapterSuffix: 'Adapter',
				fileCase: 'kebab',
				indent: 'tab',
				quotes: 'single',
				semicolons: true,
			} as TemplateContext

			const result = await renderTemplateString(template, context)

			expect(result).toContain('portSuffix: PORT')
			expect(result).toContain('adapterSuffix: Adapter')
			expect(result).toContain('fileCase: kebab')
			expect(result).toContain('indent: tab')
			expect(result).toContain('quotes: single')
			expect(result).toContain('semicolons: true')
		})
	})

	describe('real-world templates', () => {
		test('renders token template', async () => {
			const templatePath = join(testDir, 'token.hbs')
			const templateContent = `export const {{nameScreamingSnake}}_{{portSuffix}} = Symbol('{{nameScreamingSnake}}_{{portSuffix}}')
export type {{namePascal}}Token = typeof {{nameScreamingSnake}}_{{portSuffix}}`

			await writeFile(templatePath, templateContent)

			const context = {
				nameScreamingSnake: 'OBJECT_STORAGE',
				namePascal: 'ObjectStorage',
				portSuffix: 'PORT',
			} as TemplateContext

			const result = await renderTemplate(templatePath, context)

			expect(result).toContain("export const OBJECT_STORAGE_PORT = Symbol('OBJECT_STORAGE_PORT')")
			expect(result).toContain('export type ObjectStorageToken = typeof OBJECT_STORAGE_PORT')
		})

		test('renders interface template', async () => {
			const templatePath = join(testDir, 'interface.hbs')
			const templateContent = `export interface {{namePascal}}Port {
	// Add your port methods here
}`

			await writeFile(templatePath, templateContent)

			const context = {
				namePascal: 'ObjectStorage',
			} as TemplateContext

			const result = await renderTemplate(templatePath, context)

			expect(result).toContain('export interface ObjectStoragePort {')
			expect(result).toContain('// Add your port methods here')
		})

		test('renders service template with conditional module import', async () => {
			const templatePath = join(testDir, 'service.hbs')
			const templateContent = `import { Injectable } from '@nestjs/common'
{{#if includeModule}}
import { {{namePascal}}Port } from './{{nameKebab}}.port'
import { InjectPort } from 'nest-hex'
import { {{nameScreamingSnake}}_{{portSuffix}} } from './{{nameKebab}}.token'

@Injectable()
export class {{namePascal}}Service {
	constructor(
		@InjectPort({{nameScreamingSnake}}_{{portSuffix}})
		private readonly {{nameCamel}}Port: {{namePascal}}Port,
	) {}
}
{{else}}
@Injectable()
export class {{namePascal}}Service {
	// Service implementation
}
{{/if}}`

			await writeFile(templatePath, templateContent)

			const context1 = {
				namePascal: 'ObjectStorage',
				nameKebab: 'object-storage',
				nameCamel: 'objectStorage',
				nameScreamingSnake: 'OBJECT_STORAGE',
				portSuffix: 'PORT',
				includeModule: true,
			} as TemplateContext

			const context2 = {
				namePascal: 'ObjectStorage',
				includeModule: false,
			} as TemplateContext

			const result1 = await renderTemplate(templatePath, context1)
			const result2 = await renderTemplate(templatePath, context2)

			// With module
			expect(result1).toContain('@InjectPort(OBJECT_STORAGE_PORT)')
			expect(result1).toContain('private readonly objectStoragePort: ObjectStoragePort')

			// Without module
			expect(result2).toContain('@Injectable()')
			expect(result2).toContain('// Service implementation')
			expect(result2).not.toContain('@InjectPort')
		})

		test('renders index template with conditional exports', async () => {
			const templatePath = join(testDir, 'index.hbs')
			const templateContent = `export * from './{{nameKebab}}.token'
export * from './{{nameKebab}}.port'
{{#if includeService}}
export * from './{{nameKebab}}.service'
{{/if}}
{{#if includeModule}}
export * from './{{nameKebab}}.module'
{{/if}}`

			await writeFile(templatePath, templateContent)

			const context1 = {
				nameKebab: 'object-storage',
				includeService: true,
				includeModule: true,
			} as TemplateContext

			const context2 = {
				nameKebab: 'object-storage',
				includeService: false,
				includeModule: false,
			} as TemplateContext

			const result1 = await renderTemplate(templatePath, context1)
			const result2 = await renderTemplate(templatePath, context2)

			// Full exports
			expect(result1).toContain("export * from './object-storage.token'")
			expect(result1).toContain("export * from './object-storage.port'")
			expect(result1).toContain("export * from './object-storage.service'")
			expect(result1).toContain("export * from './object-storage.module'")

			// Minimal exports
			expect(result2).toContain("export * from './object-storage.token'")
			expect(result2).toContain("export * from './object-storage.port'")
			expect(result2).not.toContain("export * from './object-storage.service'")
			expect(result2).not.toContain("export * from './object-storage.module'")
		})
	})

	describe('error messages', () => {
		test('missing template file error is descriptive', async () => {
			const templatePath = join(testDir, 'missing.hbs')
			const context = {} as unknown as TemplateContext

			try {
				await renderTemplate(templatePath, context)
				expect(true).toBe(false) // Should not reach here
			} catch (error) {
				expect(error).toBeInstanceOf(Error)
				if (error instanceof Error) {
					expect(error.message).toContain('Template file not found')
					expect(error.message).toContain(templatePath)
				}
			}
		})

		test('invalid syntax error includes template path', async () => {
			const templatePath = join(testDir, 'invalid.hbs')
			await writeFile(templatePath, '{{#if broken')

			const context = {} as unknown as TemplateContext

			try {
				await renderTemplate(templatePath, context)
				expect(true).toBe(false) // Should not reach here
			} catch (error) {
				expect(error).toBeInstanceOf(Error)
				if (error instanceof Error) {
					expect(error.message).toContain('Failed to compile template')
					expect(error.message).toContain(templatePath)
				}
			}
		})
	})
})
