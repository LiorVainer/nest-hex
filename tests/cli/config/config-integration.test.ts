import { describe, expect, test, beforeEach, afterEach } from 'bun:test'
import { join } from 'node:path'
import { PortGenerator } from '../../../src/cli/generators/port.generator'
import { AdapterGenerator } from '../../../src/cli/generators/adapter.generator'
import { configBuilder, createTempDir } from '../helpers'

/**
 * Integration tests verifying that all nest-hex.config.ts configuration options
 * actually affect the generated output correctly.
 *
 * These tests ensure:
 * - Output directory configuration is respected
 * - Naming configuration affects generated names
 * - File case configuration affects file names
 * - Style configuration affects code formatting
 *
 * ⚠️ IMPLEMENTATION STATUS:
 * Many tests are currently skipped because CLI generators are partially implemented
 * (see add-cli-generator change: 35/191 tasks complete). These tests document expected
 * behavior and will be enabled as generator features are completed.
 *
 * Tests marked with test.skip need:
 * - Complete template implementation (style/formatting support)
 * - File case transformation implementation
 * - Custom directory configuration handling
 */
describe('Config Option Integration', () => {
	const tempDir = createTempDir()
	let testDir: string

	beforeEach(async () => {
		testDir = await tempDir.create()
	})

	afterEach(async () => {
		await tempDir.cleanupAll()
	})

	describe('output directory configuration', () => {
		test.skip('custom output.portsDir is used by PortGenerator', async () => {
			// TODO: Generator needs to handle custom portsDir correctly
			// Currently when outputPath is provided, it ignores config.output.portsDir

			const customPortsDir = 'custom/domain/ports'
			const config = configBuilder().withPortsDir(customPortsDir).build()
			const generator = new PortGenerator(config)

			await generator.generate({
				name: 'payment',
				outputPath: testDir,
			})

			const expectedDir = join(testDir, customPortsDir, 'payment')
			const tokenFile = Bun.file(join(expectedDir, 'payment.token.ts'))
			expect(await tokenFile.exists()).toBe(true)
		})

		test.skip('custom output.adaptersDir is used by AdapterGenerator', async () => {
			// TODO: Generator needs to handle custom adaptersDir correctly

			const customAdaptersDir = 'custom/infrastructure/adapters'
			const config = configBuilder()
				.withAdaptersDir(customAdaptersDir)
				.build()
			const generator = new AdapterGenerator(config)

			await generator.generate({
				name: 'stripe-payment',
				outputPath: testDir,
			})

			const expectedDir = join(testDir, customAdaptersDir, 'stripe-payment')
			const adapterFile = Bun.file(join(expectedDir, 'stripe-payment.adapter.ts'))
			expect(await adapterFile.exists()).toBe(true)
		})
	})

	describe('naming configuration', () => {
		test('naming.portSuffix affects generated token names', async () => {
			// Arrange
			const config = configBuilder().withPortSuffix('CONTRACT').build()
			const generator = new PortGenerator(config)

			// Act
			await generator.generate({
				name: 'payment',
				outputPath: join(testDir, 'src/ports'),
			})

			// Assert: Token uses custom suffix
			const tokenFile = join(testDir, 'src/ports/payment/payment.token.ts')
			const content = await Bun.file(tokenFile).text()

			expect(content).toContain('PAYMENT_CONTRACT')
			expect(content).toContain("Symbol('PAYMENT_CONTRACT')")
			expect(content).not.toContain('PAYMENT_PORT')
		})

		test.skip('naming.adapterSuffix affects generated class names', async () => {
			// TODO: Enable when adapter generator templates support custom suffix

			const config = configBuilder().withAdapterSuffix('Implementation').build()
			const generator = new AdapterGenerator(config)

			await generator.generate({
				name: 'stripe-payment',
				outputPath: join(testDir, 'src/adapters'),
			})

			const adapterFile = join(
				testDir,
				'src/adapters/stripe-payment/stripe-payment.adapter.ts',
			)
			const content = await Bun.file(adapterFile).text()

			expect(content).toContain('export class StripePaymentImplementation')
			expect(content).not.toContain('export class StripePaymentAdapter')
		})
	})

	describe('file case configuration', () => {
		test.skip('naming.fileCase=kebab generates kebab-case files', async () => {
			// TODO: Enable when generator implements file case transformation

			const config = configBuilder().withFileCase('kebab').build()
			const generator = new PortGenerator(config)

			await generator.generate({
				name: 'object-storage',
				outputPath: join(testDir, 'src/ports'),
			})

			const baseDir = join(testDir, 'src/ports/object-storage')
			const expectedFiles = [
				'object-storage.token.ts',
				'object-storage.port.ts',
				'object-storage.service.ts',
				'object-storage.module.ts',
			]

			for (const filename of expectedFiles) {
				const file = Bun.file(join(baseDir, filename))
				expect(await file.exists()).toBe(true)
			}
		})

		test.skip('naming.fileCase=camel generates camelCase files', async () => {
			// TODO: Enable when generator implements file case transformation

			const config = configBuilder().withFileCase('camel').build()
			const generator = new PortGenerator(config)

			await generator.generate({
				name: 'object-storage',
				outputPath: join(testDir, 'src/ports'),
			})

			const baseDir = join(testDir, 'src/ports/objectStorage')
			const expectedFiles = [
				'objectStorage.token.ts',
				'objectStorage.port.ts',
				'objectStorage.service.ts',
				'objectStorage.module.ts',
			]

			for (const filename of expectedFiles) {
				const file = Bun.file(join(baseDir, filename))
				expect(await file.exists()).toBe(true)
			}
		})

		test.skip('naming.fileCase=pascal generates PascalCase files', async () => {
			// TODO: Enable when generator implements file case transformation

			const config = configBuilder().withFileCase('pascal').build()
			const generator = new PortGenerator(config)

			await generator.generate({
				name: 'object-storage',
				outputPath: join(testDir, 'src/ports'),
			})

			const baseDir = join(testDir, 'src/ports/ObjectStorage')
			const expectedFiles = [
				'ObjectStorage.token.ts',
				'ObjectStorage.port.ts',
				'ObjectStorage.service.ts',
				'ObjectStorage.module.ts',
			]

			for (const filename of expectedFiles) {
				const file = Bun.file(join(baseDir, filename))
				expect(await file.exists()).toBe(true)
			}
		})
	})

	describe('style.indent configuration', () => {
		test.skip('style.indent=tab generates tab-indented code', async () => {
			// TODO: Enable when templates support configurable indentation

			const config = configBuilder().withIndent('tab').build()
			const generator = new PortGenerator(config)

			await generator.generate({
				name: 'payment',
				outputPath: join(testDir, 'src/ports'),
			})

			const tokenFile = join(testDir, 'src/ports/payment/payment.token.ts')
			const content = await Bun.file(tokenFile).text()

			expect(content).toMatch(/\t/)
		})

		test.skip('style.indent=2 generates 2-space indented code', async () => {
			// TODO: Enable when templates support configurable indentation

			const config = configBuilder().withIndent(2).build()
			const generator = new PortGenerator(config)

			await generator.generate({
				name: 'payment',
				outputPath: join(testDir, 'src/ports'),
			})

			const interfaceFile = join(testDir, 'src/ports/payment/payment.port.ts')
			const content = await Bun.file(interfaceFile).text()

			const lines = content.split('\n')
			const indentedLines = lines.filter((line) => /^  \w/.test(line))
			expect(indentedLines.length).toBeGreaterThan(0)
		})

		test.skip('style.indent=4 generates 4-space indented code', async () => {
			// TODO: Enable when templates support configurable indentation

			const config = configBuilder().withIndent(4).build()
			const generator = new PortGenerator(config)

			await generator.generate({
				name: 'payment',
				outputPath: join(testDir, 'src/ports'),
			})

			const interfaceFile = join(testDir, 'src/ports/payment/payment.port.ts')
			const content = await Bun.file(interfaceFile).text()

			const lines = content.split('\n')
			const indentedLines = lines.filter((line) => /^    \w/.test(line))
			expect(indentedLines.length).toBeGreaterThan(0)
		})
	})

	describe('style.quotes configuration', () => {
		test.skip('style.quotes=single generates single quotes', async () => {
			// TODO: Enable when templates support configurable quotes

			const config = configBuilder().withQuotes('single').build()
			const generator = new PortGenerator(config)

			await generator.generate({
				name: 'payment',
				outputPath: join(testDir, 'src/ports'),
			})

			const tokenFile = join(testDir, 'src/ports/payment/payment.token.ts')
			const content = await Bun.file(tokenFile).text()

			expect(content).toContain("Symbol('PAYMENT_PORT')")
			expect(content).not.toContain('Symbol("PAYMENT_PORT")')

			const serviceFile = join(testDir, 'src/ports/payment/payment.service.ts')
			const serviceContent = await Bun.file(serviceFile).text()
			expect(serviceContent).toMatch(/import .* from '.*'/)
		})

		test.skip('style.quotes=double generates double quotes', async () => {
			// TODO: Enable when templates support configurable quotes

			const config = configBuilder().withQuotes('double').build()
			const generator = new PortGenerator(config)

			await generator.generate({
				name: 'payment',
				outputPath: join(testDir, 'src/ports'),
			})

			const tokenFile = join(testDir, 'src/ports/payment/payment.token.ts')
			const content = await Bun.file(tokenFile).text()

			expect(content).toContain('Symbol("PAYMENT_PORT")')
			expect(content).not.toContain("Symbol('PAYMENT_PORT')")

			const serviceFile = join(testDir, 'src/ports/payment/payment.service.ts')
			const serviceContent = await Bun.file(serviceFile).text()
			expect(serviceContent).toMatch(/import .* from ".*"/)
		})
	})

	describe('style.semicolons configuration', () => {
		test.skip('style.semicolons=true includes semicolons', async () => {
			// TODO: Enable when templates support configurable semicolons

			const config = configBuilder().withSemicolons(true).build()
			const generator = new PortGenerator(config)

			await generator.generate({
				name: 'payment',
				outputPath: join(testDir, 'src/ports'),
			})

			const tokenFile = join(testDir, 'src/ports/payment/payment.token.ts')
			const content = await Bun.file(tokenFile).text()

			const lines = content.split('\n')
			const exportLines = lines.filter((line) => line.trim().startsWith('export'))
			const linesWithSemicolons = exportLines.filter((line) => line.endsWith(';'))

			expect(linesWithSemicolons.length).toBeGreaterThan(0)
		})

		test.skip('style.semicolons=false omits semicolons', async () => {
			// TODO: Enable when templates support configurable semicolons

			const config = configBuilder().withSemicolons(false).build()
			const generator = new PortGenerator(config)

			await generator.generate({
				name: 'payment',
				outputPath: join(testDir, 'src/ports'),
			})

			const tokenFile = join(testDir, 'src/ports/payment/payment.token.ts')
			const content = await Bun.file(tokenFile).text()

			const lines = content.split('\n')
			const exportLines = lines.filter((line) => line.trim().startsWith('export'))
			const linesWithSemicolons = exportLines.filter((line) => line.endsWith(';'))

			expect(linesWithSemicolons.length).toBe(0)
		})
	})

	describe('combined configuration', () => {
		test.skip('multiple config options work together', async () => {
			// TODO: Enable when all config options are implemented

			const config = configBuilder()
				.withPortsDir('custom/ports')
				.withPortSuffix('CONTRACT')
				.withFileCase('pascal')
				.withIndent(2)
				.withQuotes('double')
				.withSemicolons(false)
				.build()
			const generator = new PortGenerator(config)

			await generator.generate({
				name: 'payment-processor',
				outputPath: testDir,
			})

			const baseDir = join(testDir, 'custom/ports/PaymentProcessor')
			const tokenFile = Bun.file(join(baseDir, 'PaymentProcessor.token.ts'))
			expect(await tokenFile.exists()).toBe(true)

			const tokenContent = await tokenFile.text()
			expect(tokenContent).toContain('PAYMENT_PROCESSOR_CONTRACT')
			expect(tokenContent).toContain('Symbol("PAYMENT_PROCESSOR_CONTRACT")')

			const lines = tokenContent.split('\n')
			const exportLines = lines.filter((line) => line.trim().startsWith('export'))
			const linesWithSemicolons = exportLines.filter((line) => line.endsWith(';'))
			expect(linesWithSemicolons.length).toBe(0)

			const interfaceFile = join(baseDir, 'PaymentProcessor.port.ts')
			const interfaceContent = await Bun.file(interfaceFile).text()
			const indentedLines = interfaceContent
				.split('\n')
				.filter((line) => /^  \w/.test(line))
			expect(indentedLines.length).toBeGreaterThan(0)
		})
	})
})
