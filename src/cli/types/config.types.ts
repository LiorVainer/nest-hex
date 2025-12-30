/**
 * Configuration types for nest-hex CLI
 */

export interface NestHexConfig {
	/**
	 * Output directory configuration
	 */
	output?: {
		/**
		 * Directory for generated ports
		 * @default 'src/ports'
		 */
		portsDir?: string

		/**
		 * Directory for generated adapters
		 * @default 'src/adapters'
		 */
		adaptersDir?: string
	}

	/**
	 * Naming conventions
	 */
	naming?: {
		/**
		 * Suffix for port tokens
		 * @default 'PORT'
		 */
		portSuffix?: string

		/**
		 * Suffix for adapter classes
		 * @default 'Adapter'
		 */
		adapterSuffix?: string

		/**
		 * File naming case
		 * @default 'kebab'
		 */
		fileCase?: 'kebab' | 'camel' | 'pascal'
	}

	/**
	 * Code style preferences
	 */
	style?: {
		/**
		 * Indentation style
		 * @default 'tab'
		 */
		indent?: 'tab' | 2 | 4

		/**
		 * Quote style
		 * @default 'single'
		 */
		quotes?: 'single' | 'double'

		/**
		 * Use semicolons
		 * @default true
		 */
		semicolons?: boolean
	}

	/**
	 * Custom template paths
	 */
	templates?: {
		portModule?: string
		portToken?: string
		portInterface?: string
		portService?: string
		adapterModule?: string
		adapterService?: string
		adapterTypes?: string
	}
}
