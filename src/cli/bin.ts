#!/usr/bin/env node

/**
 * nest-hex CLI entry point
 */

import { Command } from 'commander'

const program = new Command()

program
	.name('nest-hex')
	.description('CLI for generating nest-hex modules')
	.version('0.1.0')

program
	.command('generate')
	.description('Generate nest-hex components')
	.action(() => {
		console.log('CLI is working! Full implementation coming soon...')
	})

program.parse()
