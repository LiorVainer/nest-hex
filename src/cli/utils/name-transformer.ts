/**
 * Name transformation utilities
 */

export function toKebabCase(str: string): string {
	return str
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.toLowerCase()
}

export function toCamelCase(str: string): string {
	return str
		.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
		.replace(/^[A-Z]/, (c) => c.toLowerCase())
}

export function toPascalCase(str: string): string {
	const camel = toCamelCase(str)
	return camel.charAt(0).toUpperCase() + camel.slice(1)
}

export function toSnakeCase(str: string): string {
	return str
		.replace(/([a-z0-9])([A-Z])/g, '$1_$2')
		.replace(/[\s-]+/g, '_')
		.toLowerCase()
}

export function toScreamingSnakeCase(str: string): string {
	return toSnakeCase(str).toUpperCase()
}

export interface NameVariations {
	original: string
	kebab: string
	camel: string
	pascal: string
	snake: string
	screamingSnake: string
}

export function generateNameVariations(name: string): NameVariations {
	return {
		original: name,
		kebab: toKebabCase(name),
		camel: toCamelCase(name),
		pascal: toPascalCase(name),
		snake: toSnakeCase(name),
		screamingSnake: toScreamingSnakeCase(name),
	}
}
