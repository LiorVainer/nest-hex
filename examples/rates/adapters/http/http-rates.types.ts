/**
 * HTTP Rates Adapter Types
 *
 * This file defines configuration options for the HTTP-based currency rates adapter.
 */

import type { AdapterConfig } from '../../../../src'
import type { CURRENCY_RATES_TOKEN } from '../../currency-rates.token'
import type { CurrencyRatesPort } from '../../currency-rates.port'

/**
 * Configuration options for the HTTP rates adapter.
 */
export interface HttpRatesOptions {
	/**
	 * Base URL of the exchange rates API.
	 *
	 * @example 'https://api.exchangerate.host'
	 * @example 'https://api.exchangeratesapi.io/v1'
	 */
	apiUrl: string

	/**
	 * API key for authentication (if required by the API).
	 *
	 * Some APIs (like exchangeratesapi.io) require an API key.
	 * Others (like exchangerate.host) are free and don't require one.
	 */
	apiKey?: string

	/**
	 * Timeout for HTTP requests in milliseconds.
	 *
	 * @default 5000
	 */
	timeoutMs?: number

	/**
	 * Maximum number of retry attempts for failed requests.
	 *
	 * @default 3
	 */
	maxRetries?: number

	/**
	 * Whether to use HTTPS (for local development with self-signed certs).
	 *
	 * @default true
	 */
	useHttps?: boolean
}

/**
 * API Response Format Examples:
 *
 * Most exchange rate APIs follow similar response formats:
 *
 * exchangerate.host:
 * {
 *   "success": true,
 *   "base": "USD",
 *   "date": "2024-01-15",
 *   "rates": {
 *     "EUR": 0.85,
 *     "GBP": 0.73
 *   }
 * }
 *
 * exchangeratesapi.io:
 * {
 *   "success": true,
 *   "timestamp": 1705334400,
 *   "base": "USD",
 *   "date": "2024-01-15",
 *   "rates": {
 *     "EUR": 0.85,
 *     "GBP": 0.73
 *   }
 * }
 */

/**
 * Type alias for the currency rates port token.
 */
export type CurrencyRatesToken = typeof CURRENCY_RATES_TOKEN

/**
 * Type-safe adapter configuration for HTTP rates adapter.
 *
 * This type ensures that the adapter's portToken and implementation
 * are correctly typed and match the CurrencyRatesPort interface.
 */
export type HttpRatesAdapterConfig = AdapterConfig<
	CurrencyRatesToken,
	CurrencyRatesPort
>
