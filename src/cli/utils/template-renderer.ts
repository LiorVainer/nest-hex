/**
 * Template rendering utilities using EJS
 */

import * as fs from 'node:fs'
import * as ejs from 'ejs'
import type { TemplateContext } from '../types'

export async function renderTemplate(
	templatePath: string,
	context: TemplateContext,
): Promise<string> {
	const template = fs.readFileSync(templatePath, 'utf8')
	return ejs.render(template, context)
}

export async function renderTemplateString(
	templateString: string,
	context: TemplateContext,
): Promise<string> {
	return ejs.render(templateString, context)
}
