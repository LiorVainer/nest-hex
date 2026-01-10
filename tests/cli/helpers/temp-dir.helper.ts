import { mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

/**
 * Helper for managing temporary test directories.
 * Provides isolated filesystem for each test with automatic cleanup.
 *
 * @example
 * ```typescript
 * import { createTempDir } from './helpers/temp-dir.helper'
 *
 * describe('my test', () => {
 *   const tempDir = createTempDir()
 *
 *   beforeEach(async () => {
 *     testDir = await tempDir.create()
 *   })
 *
 *   afterEach(async () => {
 *     await tempDir.cleanupAll()
 *   })
 * })
 * ```
 */
export function createTempDir() {
	const dirs: string[] = []

	return {
		/**
		 * Create a new temporary directory with unique name.
		 * Directory will be automatically cleaned up after test.
		 */
		async create(): Promise<string> {
			const dir = join(
				tmpdir(),
				`nest-hex-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
			)
			await mkdir(dir, { recursive: true })
			dirs.push(dir)
			return dir
		},

		/**
		 * Manually cleanup a specific directory.
		 */
		async cleanup(dir: string): Promise<void> {
			await rm(dir, { recursive: true, force: true })
			const index = dirs.indexOf(dir)
			if (index > -1) {
				dirs.splice(index, 1)
			}
		},

		/**
		 * Cleanup all created directories.
		 * Call this in afterEach or afterAll.
		 */
		async cleanupAll(): Promise<void> {
			await Promise.all(dirs.map((dir) => rm(dir, { recursive: true, force: true })))
			dirs.length = 0
		},
	}
}
