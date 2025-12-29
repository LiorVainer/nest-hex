/**
 * Default configuration for nest-hex CLI
 */

import type { NestHexConfig } from '../types'

export const defaultConfig: Required<NestHexConfig> = {
	output: {
		portsDir: 'src/ports',
		adaptersDir: 'src/adapters',
	},
	naming: {
		portSuffix: 'PORT',
		adapterSuffix: 'Adapter',
		fileCase: 'kebab',
	},
	style: {
		indent: 'tab',
		quotes: 'single',
		semicolons: true,
	},
	templates: {},
}
