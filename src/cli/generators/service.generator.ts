/**
 * Service Generator
 *
 * Generates standalone services that consume existing ports via @InjectPort.
 */

import { join } from 'node:path'
import type {
	FileToGenerate,
	GeneratorOptions,
	GeneratorResult,
} from '../types'
import { BaseGenerator } from './base.generator'

/**
 * Generator for creating standalone services.
 *
 * Generates:
 * - Injectable service that uses @InjectPort to inject an existing port
 * - Can be created with or without port injection scaffolding
 */
export class ServiceGenerator extends BaseGenerator {
	/**
	 * Generate service file.
	 */
	async generate(options: GeneratorOptions): Promise<GeneratorResult> {
		const context = this.createTemplateContext(options)
		const templateDir = this.getTemplateDir('service')

		// Determine output directory
		const outputDir =
			options.outputPath ||
			this.resolvePath(this.config.output?.portsDir || 'src/services')
		const serviceDir = join(outputDir, context.nameKebab)

		// Generate file list
		const files: FileToGenerate[] = []

		// Service file
		const serviceContent = await this.renderTemplate(
			join(templateDir, 'injectable-service.hbs'),
			context,
		)
		files.push({
			path: join(serviceDir, `${context.nameKebab}.service.ts`),
			content: serviceContent,
		})

		// Generate all files
		const generatedFiles = await this.generateFiles(files, options.dryRun)

		return {
			success: true,
			files: generatedFiles,
			message: `Successfully generated ${generatedFiles.length} service file${generatedFiles.length !== 1 ? 's' : ''}`,
		}
	}
}
