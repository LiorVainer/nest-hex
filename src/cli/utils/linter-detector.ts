/**
 * Detects available linters in the project
 */

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export interface LinterConfig {
	type: 'biome' | 'prettier' | 'script' | 'none'
	command?: string
	args?: string[]
	description?: string
}

/**
 * Detects which linter is available in the project
 * Priority: Biome > Prettier > lint script > none
 */
export async function detectLinter(projectRoot: string): Promise<LinterConfig> {
	// Check for Biome
	const biomeConfigExists =
		existsSync(join(projectRoot, 'biome.json')) ||
		existsSync(join(projectRoot, 'biome.jsonc'))

	const packageJsonPath = join(projectRoot, 'package.json')
	let packageJson: {
		devDependencies?: Record<string, string>
		scripts?: Record<string, string>
	} = {}

	if (existsSync(packageJsonPath)) {
		try {
			packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
		} catch {
			// Invalid package.json, continue with empty object
		}
	}

	const hasBiomeDep =
		packageJson.devDependencies?.['@biomejs/biome'] ||
		packageJson.devDependencies?.biome

	if (biomeConfigExists || hasBiomeDep) {
		return {
			type: 'biome',
			command: 'biome',
			args: ['check', '--write'],
			description: 'Formatting with Biome',
		}
	}

	// Check for Prettier
	const prettierConfigFiles = [
		'.prettierrc',
		'.prettierrc.json',
		'.prettierrc.yml',
		'.prettierrc.yaml',
		'.prettierrc.js',
		'.prettierrc.cjs',
		'prettier.config.js',
		'prettier.config.cjs',
	]

	const prettierConfigExists = prettierConfigFiles.some((file) =>
		existsSync(join(projectRoot, file)),
	)

	const hasPrettierDep = packageJson.devDependencies?.prettier

	if (prettierConfigExists || hasPrettierDep) {
		return {
			type: 'prettier',
			command: 'prettier',
			args: ['--write'],
			description: 'Formatting with Prettier',
		}
	}

	// Check for lint scripts in package.json
	const lintScripts = packageJson.scripts
	if (lintScripts) {
		if (lintScripts['lint:fix']) {
			return {
				type: 'script',
				command: 'bun',
				args: ['run', 'lint:fix'],
				description: 'Running lint:fix script',
			}
		}
		if (lintScripts.lint) {
			return {
				type: 'script',
				command: 'bun',
				args: ['run', 'lint'],
				description: 'Running lint script',
			}
		}
	}

	// No linter found
	return {
		type: 'none',
		description: 'No linter detected',
	}
}
