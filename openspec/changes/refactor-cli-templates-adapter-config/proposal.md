# Change: Refactor CLI Templates to Use AdapterConfig Generic Type

## Why

The current CLI templates generate adapter code that doesn't leverage the full type safety capabilities of the `@Adapter` decorator. Specifically:

1. **Missing AdapterConfig type alias**: Templates don't generate the `AdapterConfig<TToken, TPort>` type alias that provides better type safety and IDE autocompletion
2. **No generic type parameter on @Adapter**: Templates use `@Adapter({...})` instead of `@Adapter<AdapterConfig>({...})`, losing compile-time type checking
3. **Inconsistent with examples**: The generated code doesn't match the pattern shown in the examples (e.g., `http-rates.adapter.ts`), causing confusion for developers

This creates a disconnect between the library's type-safe capabilities and what the CLI actually generates, leading to suboptimal developer experience and missed type errors.

## What Changes

### Port Interface Template (`port/interface.hbs` or `port.hbs`)
- **Add** example method signatures as comments to guide users:
  ```typescript
  export interface {Name}Port {
    // Example method signatures (uncomment and modify as needed):
    // get{Entity}(id: string): Promise<{Entity}>
    // create{Entity}(data: Create{Entity}Dto): Promise<{Entity}>
  }
  ```

### Adapter Types Template (`adapter/types.hbs`)
- **Add** `AdapterConfig` type alias export using the pattern:
  ```typescript
  export type {AdapterName}AdapterConfig = AdapterConfig<{PortName}Token, {PortName}Port>
  ```
- **Add** import for `AdapterConfig` from core types
- **Add** import for the port token from port token file
- **Add** import for the port interface from port file
- **Add** example properties in options interface:
  ```typescript
  export interface {AdapterName}Options {
    // Example configuration properties (modify as needed):
    // apiUrl?: string
    // apiKey?: string
    // timeout?: number
  }
  ```

### Adapter Template (`adapter/adapter.hbs`)
- **Update** `@Adapter` decorator to use generic type parameter:
  ```typescript
  @Adapter<{AdapterName}AdapterConfig>({...})
  ```
- **Add** import for the `{AdapterName}AdapterConfig` type from the adapter's own types file

### Template Variables
- Ensure all templates have access to:
  - Port interface name (e.g., `CurrencyRatesPort`)
  - Proper import paths for `AdapterConfig` type

## Impact

### Affected Specs
- `cli-generator` - Template generation logic

### Affected Code
- `src/cli/templates/port/interface.hbs` - Add example method signatures as comments
- `src/cli/templates/adapter/types.hbs` - Add AdapterConfig type alias export and example properties
- `src/cli/templates/adapter/adapter.hbs` - Use generic type parameter
- CLI generator logic to provide port token and interface names to adapter types template
- `examples/rates/currency-rates.port.ts` - Add example method comments
- `examples/rates/adapters/http/http-rates.types.ts` - Update with real properties and AdapterConfig
- `examples/rates/adapters/http/http-rates.adapter.ts` - Use generic type parameter, import from own types file
- `examples/rates/adapters/mock/mock-rates.types.ts` - **NEW FILE** if mock adapter exists
- `examples/rates/adapters/mock/mock-rates.adapter.ts` - Use generic type parameter (if exists)
- All files in `docs/` folder that show adapter examples
- `README.md` - Update example code snippets to show AdapterConfig pattern

### User-Facing Changes
- **Generated adapter types files** (`adapters/{name}/{name}.types.ts`) will export `{Name}AdapterConfig` type
- **Generated adapter files** will use `@Adapter<{Name}AdapterConfig>` pattern
- **Better type safety** for developers using generated code
- **Consistent examples** across `/examples`, documentation, and README
- **Improved documentation** showing best practices with full type safety

### Breaking Changes
**None** - This only affects newly generated code. Existing adapters continue to work unchanged. The non-generic `@Adapter({...})` syntax remains valid.
