/**
 * Path resolution utilities
 */

import * as path from 'node:path'

export function resolvePath(...segments: string[]): string {
	return path.resolve(...segments)
}

export function joinPaths(...segments: string[]): string {
	return path.join(...segments)
}

export function getRelativePath(from: string, to: string): string {
	const relativePath = path.relative(from, to)
	// Always use forward slashes in imports
	return relativePath.replace(/\\/g, '/')
}

export function getImportPath(from: string, to: string): string {
	const relative = getRelativePath(path.dirname(from), to)
	// Remove file extension
	const withoutExt = relative.replace(/\.(ts|js)$/, '')
	// Ensure it starts with ./ for relative imports
	return withoutExt.startsWith('.') ? withoutExt : `./${withoutExt}`
}
