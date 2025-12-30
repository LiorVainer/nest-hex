/**
 * Configuration validation for nest-hex CLI
 */

import type { NestHexConfig } from '../types'

export class ConfigValidationError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'ConfigValidationError'
	}
}

/**
 * Validates nest-hex configuration
 * @throws {ConfigValidationError} If configuration is invalid
 */
export function validateConfig(config: NestHexConfig): void {
	// Validate style.indent
	if (config.style?.indent !== undefined) {
		const validIndents = ['tab', 2, 4] as const
		if (!validIndents.includes(config.style.indent as never)) {
			throw new ConfigValidationError(
				`Invalid configuration: indent must be 'tab', 2, or 4. Got: ${config.style.indent}`,
			)
		}
	}

	// Validate style.quotes
	if (config.style?.quotes !== undefined) {
		const validQuotes = ['single', 'double'] as const
		if (!validQuotes.includes(config.style.quotes)) {
			throw new ConfigValidationError(
				`Invalid configuration: quotes must be 'single' or 'double'. Got: ${config.style.quotes}`,
			)
		}
	}

	// Validate naming.fileCase
	if (config.naming?.fileCase !== undefined) {
		const validCases = ['kebab', 'camel', 'pascal'] as const
		if (!validCases.includes(config.naming.fileCase)) {
			throw new ConfigValidationError(
				`Invalid configuration: fileCase must be 'kebab', 'camel', or 'pascal'. Got: ${config.naming.fileCase}`,
			)
		}
	}

	// Validate output directories are strings if provided
	if (
		config.output?.portsDir !== undefined &&
		typeof config.output.portsDir !== 'string'
	) {
		throw new ConfigValidationError(
			`Invalid configuration: portsDir must be a string. Got: ${typeof config.output.portsDir}`,
		)
	}

	if (
		config.output?.adaptersDir !== undefined &&
		typeof config.output.adaptersDir !== 'string'
	) {
		throw new ConfigValidationError(
			`Invalid configuration: adaptersDir must be a string. Got: ${typeof config.output.adaptersDir}`,
		)
	}

	// Validate naming suffixes are strings if provided
	if (
		config.naming?.portSuffix !== undefined &&
		typeof config.naming.portSuffix !== 'string'
	) {
		throw new ConfigValidationError(
			`Invalid configuration: portSuffix must be a string. Got: ${typeof config.naming.portSuffix}`,
		)
	}

	if (
		config.naming?.adapterSuffix !== undefined &&
		typeof config.naming.adapterSuffix !== 'string'
	) {
		throw new ConfigValidationError(
			`Invalid configuration: adapterSuffix must be a string. Got: ${typeof config.naming.adapterSuffix}`,
		)
	}

	// Validate template paths are strings if provided
	if (config.templates) {
		const templateKeys = Object.keys(config.templates) as Array<
			keyof typeof config.templates
		>
		for (const key of templateKeys) {
			const value = config.templates[key]
			if (value !== undefined && typeof value !== 'string') {
				throw new ConfigValidationError(
					`Invalid configuration: templates.${key} must be a string. Got: ${typeof value}`,
				)
			}
		}
	}
}
