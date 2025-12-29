/**
 * Template context types
 */

export interface TemplateContext {
	// Name variations
	name: string
	nameCamel: string
	nameKebab: string
	namePascal: string
	nameSnake: string
	nameScreamingSnake: string

	// Import paths (relative to output file)
	tokenImportPath: string
	portImportPath: string
	serviceImportPath: string

	// Style preferences
	indent: string
	quote: string
	semi: string

	// Metadata
	timestamp: string
	author?: string

	// Options
	includeModule?: boolean
	registrationType?: 'sync' | 'async'
}
