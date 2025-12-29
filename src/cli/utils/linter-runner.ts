/**
 * Runs linters on generated files
 */

import { exec } from 'node:child_process'
import type { LinterConfig } from './linter-detector'

export interface LintResult {
	success: boolean
	stdout: string
	stderr: string
	code: number | null
}

/**
 * Runs the detected linter on specified files
 */
export async function runLinter(
	linterConfig: LinterConfig,
	files: string[],
	cwd: string,
): Promise<LintResult> {
	if (
		linterConfig.type === 'none' ||
		!linterConfig.command ||
		!linterConfig.args
	) {
		return {
			success: true,
			stdout: '',
			stderr: '',
			code: 0,
		}
	}

	return new Promise((resolve) => {
		const args = linterConfig.args || []
		const command = `${linterConfig.command} ${args.join(' ')} ${files.join(' ')}`

		exec(command, { cwd }, (error, stdout, stderr) => {
			if (error) {
				resolve({
					success: false,
					stdout,
					stderr,
					code: error.code ?? null,
				})
			} else {
				resolve({
					success: true,
					stdout,
					stderr,
					code: 0,
				})
			}
		})
	})
}
