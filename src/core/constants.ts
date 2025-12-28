/**
 * Metadata key for storing the port token in adapter class metadata.
 * Used by the @AdapterToken decorator to store which token the adapter provides.
 */
export const ADAPTER_TOKEN_METADATA: unique symbol = Symbol(
	'ADAPTER_TOKEN_METADATA',
)

/**
 * Metadata key for storing the implementation class in adapter class metadata.
 * Used by the @AdapterImpl decorator to store the concrete implementation class.
 */
export const ADAPTER_IMPL_METADATA: unique symbol = Symbol(
	'ADAPTER_IMPL_METADATA',
)
