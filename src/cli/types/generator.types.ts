/**
 * Generator types for CLI
 */

export interface GeneratorOptions {
	name: string
	outputPath: string
	includeModule?: boolean
	registrationType?: 'sync' | 'async'
	generateExample?: boolean
}

export interface GeneratorContext {
	config: import('./config.types').NestHexConfig
	options: GeneratorOptions
}

export interface FileToGenerate {
	path: string
	content: string
	description: string
}

export interface GeneratorResult {
	files: FileToGenerate[]
	success: boolean
	message?: string
}
