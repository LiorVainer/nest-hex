/**
 * Template rendering utilities using EJS
 * Uses Bun's native file reading for better performance
 */

import * as ejs from 'ejs'
import type { TemplateContext } from '../types'

export async function renderTemplate(
	templatePath: string,
	context: TemplateContext,
): Promise<string> {
	const file = Bun.file(templatePath)
	const template = await file.text()
	return ejs.render(template, context)
}

export async function renderTemplateString(
	templateString: string,
	context: TemplateContext,
): Promise<string> {
	return ejs.render(templateString, context)
}
