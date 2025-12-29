/**
 * File writing utilities with conflict detection
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

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

	// Check if file exists
	const existed = fs.existsSync(filePath)

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
		// Ensure directory exists
		const dir = path.dirname(filePath)
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true })
		}

		// Write file
		fs.writeFileSync(filePath, content, 'utf8')

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

export function ensureDirectory(dirPath: string): void {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true })
	}
}
