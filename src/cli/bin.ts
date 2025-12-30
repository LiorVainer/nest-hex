#!/usr/bin/env node

/**
 * nest-hex CLI entry point
 */

import { Command } from 'commander'
import { generateCommand, initCommand } from './commands'

const program = new Command()

program
	.name('nest-hex')
	.description(
		'Interactive CLI for generating nest-hex modules (Ports & Adapters)',
	)
	.version('0.1.0')

// Init command - creates nest-hex.config.ts
program
	.command('init')
	.description('Initialize nest-hex configuration file')
	.option('-f, --force', 'Overwrite existing configuration file')
	.action(async (options) => {
		await initCommand(options)
	})

// Generate command - creates ports, adapters, services
program
	.command('generate [type] [portName] [adapterName]')
	.description(
		'Generate nest-hex components (port, adapter, service, full)\n' +
			'  For "full" type: nest-hex generate full <portName> <adapterName>',
	)
	.option('-o, --output-path <path>', 'Custom output directory')
	.option('-d, --dry-run', 'Preview files without writing to disk')
	.option('-f, --force', 'Overwrite existing files without prompting')
	.option('--no-lint', 'Skip automatic linting')
	.option('-p, --port <port>', 'Port name (for adapter generation)')
	.action(
		async (
			type?: string,
			portName?: string,
			adapterName?: string,
			options = {},
		) => {
			const validTypes = ['port', 'adapter', 'service', 'full']

			// If type is provided, validate it
			if (type && !validTypes.includes(type)) {
				console.error(
					`Invalid type: ${type}. Must be one of: ${validTypes.join(', ')}`,
				)
				process.exit(1)
			}

			// For 'full' type, we need both portName and adapterName
			// For other types, portName is actually the component name
			const name = type === 'full' ? undefined : portName

			await generateCommand({
				type: type as 'port' | 'adapter' | 'service' | 'full' | undefined,
				name,
				portName: type === 'full' ? portName : undefined,
				adapterName: type === 'full' ? adapterName : undefined,
				...options,
			})
		},
	)

// Help command improvements
program.on('--help', () => {
	console.log('')
	console.log('Examples:')
	console.log('  $ nest-hex init')
	console.log('  $ nest-hex generate port ObjectStorage')
	console.log('  $ nest-hex generate adapter S3 --port ObjectStorage')
	console.log('  $ nest-hex generate service FileUpload --port ObjectStorage')
	console.log('  $ nest-hex generate full ObjectStorage S3')
	console.log('')
})

program.parse()
