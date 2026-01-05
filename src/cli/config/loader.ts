/**
 * Configuration loader
 * Uses Bun's native file checking when available for better performance
 */

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { merge } from 'ts-deepmerge'
import type { NestHexConfig } from '../types'
import { defaultConfig } from './defaults'

export async function loadConfig(
	cwd: string = process.cwd(),
): Promise<NestHexConfig> {
	const configPath = join(cwd, 'nest-hex.config.ts')

	// Check if config exists - use Bun API if available for better performance
	const configExists =
		typeof Bun !== 'undefined'
			? await Bun.file(configPath).exists()
			: existsSync(configPath)

	if (!configExists) {
		return defaultConfig
	}

	try {
		// Dynamic import works natively in Bun with TypeScript
		// Convert to file:// URL for Windows ESM compatibility
		const configUrl = pathToFileURL(configPath).href
		const config = await import(configUrl)
		// Use deep merge to properly merge nested config objects
		return merge(defaultConfig, config.default ?? {}) as NestHexConfig
	} catch (error) {
		// Log error but continue with defaults - this allows CLI to work even with invalid config
		console.error(`\nWarning: Failed to load configuration from ${configPath}`)
		console.error('Using default configuration instead.\n')
		if (error instanceof Error) {
			console.error(`Error: ${error.message}\n`)
		}
		return defaultConfig
	}
}
