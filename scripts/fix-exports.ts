#!/usr/bin/env bun
/**
 * Post-build script to fix duplicate exports in bundled files
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

function fixDuplicateExports(filePath: string): boolean {
	const content = readFileSync(filePath, 'utf-8')

	// Find all export statements
	const exportRegex = /^export\s*\{[^}]+\};?\s*$/gm
	const exports = content.match(exportRegex)

	if (!exports || exports.length <= 1) {
		return false
	}

	// Keep only the last export statement
	let fixed = content
	for (let i = 0; i < exports.length - 1; i++) {
		fixed = fixed.replace(exports[i], '')
	}

	// Clean up extra newlines
	fixed = fixed.replace(/\n{3,}/g, '\n\n')

	if (fixed !== content) {
		writeFileSync(filePath, fixed, 'utf-8')
		console.log(`✓ Fixed duplicate exports in ${filePath}`)
		return true
	}

	return false
}

function processDirectory(dir: string): number {
	let fixedCount = 0
	const items = readdirSync(dir)

	for (const item of items) {
		const fullPath = join(dir, item)
		const stat = statSync(fullPath)

		if (stat.isDirectory()) {
			fixedCount += processDirectory(fullPath)
		} else if (item.endsWith('.js')) {
			if (fixDuplicateExports(fullPath)) {
				fixedCount++
			}
		}
	}

	return fixedCount
}

const distDir = join(process.cwd(), 'dist')
console.log('Fixing duplicate exports in dist directory...')
const fixedCount = processDirectory(distDir)
console.log(`✓ Fixed ${fixedCount} files`)
