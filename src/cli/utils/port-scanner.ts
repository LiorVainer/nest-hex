/**
 * Port Scanner
 *
 * Scans the ports directory to find all available port tokens
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { NestHexConfig } from '../types'

export interface PortInfo {
	/** Port name in kebab-case (e.g., 'object-storage') */
	name: string
	/** Port name in PascalCase (e.g., 'ObjectStorage') */
	pascalName: string
	/** Token name (e.g., 'OBJECT_STORAGE_PORT') */
	tokenName: string
	/** Relative import path from adapter to port token file */
	tokenImportPath: string
	/** Absolute path to port directory */
	portPath: string
}

/**
 * Scans the ports directory and returns information about all available ports
 */
export function scanAvailablePorts(
	config: NestHexConfig,
	projectRoot: string = process.cwd(),
): PortInfo[] {
	const portsDir = config.output?.portsDir || 'src/ports'
	const portsDirPath = join(projectRoot, portsDir)

	if (!existsSync(portsDirPath)) {
		return []
	}

	const ports: PortInfo[] = []

	// Read all subdirectories in ports directory
	const entries = readdirSync(portsDirPath, { withFileTypes: true })

	for (const entry of entries) {
		if (!entry.isDirectory()) {
			continue
		}

		const portName = entry.name
		const portPath = join(portsDirPath, portName)

		// Look for token file: {port-name}.token.ts
		const tokenFileName = `${portName}.token.ts`
		const tokenFilePath = join(portPath, tokenFileName)

		if (!existsSync(tokenFilePath)) {
			continue
		}

		// Read token file to extract token name
		const tokenFileContent = readFileSync(tokenFilePath, 'utf-8')

		// Extract token name from export statement
		// Pattern: export const TOKEN_NAME = Symbol('TOKEN_NAME')
		const tokenMatch = tokenFileContent.match(
			/export\s+const\s+([A-Z_]+)\s*=\s*Symbol/,
		)

		if (!tokenMatch || !tokenMatch[1]) {
			continue
		}

		const tokenName = tokenMatch[1]

		// Convert kebab-case to PascalCase
		const pascalName = portName
			.split('-')
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join('')

		// Calculate import path from adapter directory to port token
		// Adapters are at: {adaptersDir}/{adapterName}/
		// Ports are at: {portsDir}/{portName}/
		// So from adapter, we go: ../../ports/{portName}
		const portsDirName = portsDir.split('/').pop() || 'ports'
		const tokenImportPath = `../../${portsDirName}/${portName}`

		ports.push({
			name: portName,
			pascalName,
			tokenName,
			tokenImportPath,
			portPath,
		})
	}

	return ports
}

/**
 * Finds a specific port by name
 */
export function findPortByName(
	portName: string,
	config: NestHexConfig,
	projectRoot: string = process.cwd(),
): PortInfo | null {
	const ports = scanAvailablePorts(config, projectRoot)
	return ports.find((p) => p.name === portName) || null
}
