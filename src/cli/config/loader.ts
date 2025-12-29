/**
 * Configuration loader
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import type { NestHexConfig } from '../types'
import { defaultConfig } from './defaults'

export async function loadConfig(
	cwd: string = process.cwd(),
): Promise<NestHexConfig> {
	const configPath = path.join(cwd, 'nest-hex.config.ts')

	if (!fs.existsSync(configPath)) {
		return defaultConfig
	}

	try {
		// For simplicity, use dynamic import
		// In production, you might want to use tsx or esbuild
		const config = await import(configPath)
		return { ...defaultConfig, ...config.default }
	} catch (error) {
		console.warn('Failed to load config, using defaults:', error)
		return defaultConfig
	}
}
