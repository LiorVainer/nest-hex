/**
 * Currency Rates Port Token
 *
 * This file defines the port token for currency exchange rate capabilities.
 */

/**
 * Port token for currency rates provider.
 *
 * This token represents the abstract capability of fetching currency exchange rates.
 * Different adapters (HTTP API, database cache, mock) can provide this capability.
 */
export const CURRENCY_RATES_TOKEN = Symbol('CURRENCY_RATES_TOKEN')

/**
 * Type alias for the token.
 */
export type CurrencyRatesToken = typeof CURRENCY_RATES_TOKEN
