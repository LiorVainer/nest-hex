/**
 * File writing utilities with conflict detection
 * Uses Bun's native APIs when available for better performance
 */

import { existsSync } from 'node:fs'
import { writeFile as fsWriteFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

export interface WriteOptions {
	force?: boolean
	dryRun?: boolean
}

export interface WriteResult {
	success: boolean
	path: string
	existed: boolean
	written: boolean
	message?: string
}

export async function writeFile(
	filePath: string,
	content: string,
	options: WriteOptions = {},
): Promise<WriteResult> {
	const { force = false, dryRun = false } = options

	// Check if file exists - use Bun API if available for better performance
	const existed =
		typeof Bun !== 'undefined'
			? await Bun.file(filePath).exists()
			: existsSync(filePath)

	// If file exists and not forcing, return conflict
	if (existed && !force && !dryRun) {
		return {
			success: false,
			path: filePath,
			existed: true,
			written: false,
			message: 'File already exists. Use --force to overwrite.',
		}
	}

	// Dry run - don't actually write
	if (dryRun) {
		return {
			success: true,
			path: filePath,
			existed,
			written: false,
			message: 'Dry run - file not written',
		}
	}

	try {
		// Use Bun.write if available (automatically creates parent directories)
		// Otherwise use Node.js fs APIs
		if (typeof Bun !== 'undefined') {
			await Bun.write(filePath, content)
		} else {
			await mkdir(dirname(filePath), { recursive: true })
			await fsWriteFile(filePath, content, 'utf-8')
		}

		return {
			success: true,
			path: filePath,
			existed,
			written: true,
			message: existed ? 'File overwritten' : 'File created',
		}
	} catch (error) {
		return {
			success: false,
			path: filePath,
			existed,
			written: false,
			message: `Failed to write file: ${error instanceof Error ? error.message : String(error)}`,
		}
	}
}
