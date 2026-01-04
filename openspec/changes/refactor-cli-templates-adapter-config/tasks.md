# Implementation Tasks

## 1. Update CLI Templates
- [ ] 1.1 Update `src/cli/templates/port/interface.hbs` (or `port.hbs`)
  - [ ] 1.1.1 Add commented example method signatures
  - [ ] 1.1.2 Use contextual entity name in examples (e.g., `get{Entity}`, `create{Entity}`)
  - [ ] 1.1.3 Add helpful comment: "Example method signatures (uncomment and modify as needed)"
- [ ] 1.2 Update `src/cli/templates/adapter/types.hbs` template
  - [ ] 1.2.1 Add commented example properties to options interface (apiUrl, apiKey, timeout)
  - [ ] 1.2.2 Add import for `AdapterConfig` from `nest-hex/core/types`
  - [ ] 1.2.3 Add import for port token from port token file
  - [ ] 1.2.4 Add import for port interface from port file
  - [ ] 1.2.5 Add export: `export type {AdapterName}AdapterConfig = AdapterConfig<{PortName}Token, {PortName}Port>`
- [ ] 1.3 Update `src/cli/templates/adapter/adapter.hbs` to use generic type parameter
  - [ ] 1.3.1 Add import for `{AdapterName}AdapterConfig` from adapter's own types file (`./{{nameKebab}}.types`)
  - [ ] 1.3.2 Update `@Adapter` decorator to: `@Adapter<{AdapterName}AdapterConfig>({...})`

## 2. Update Template Variables/Logic
- [ ] 2.1 Ensure CLI generator provides port token name to adapter types template
- [ ] 2.2 Ensure CLI generator provides port interface name to adapter types template
- [ ] 2.3 Ensure CLI generator provides correct import paths for port token and interface files
- [ ] 2.4 Update template rendering logic to handle new imports in types.hbs

## 3. Update Examples
- [ ] 3.1 Update `examples/rates/currency-rates.port.ts`
  - [ ] 3.1.1 Add example method signatures as comments
  - [ ] 3.1.2 Use relevant method names (e.g., `getRate`, `convertCurrency`)
- [ ] 3.2 **Create or Update** `examples/rates/adapters/http/http-rates.types.ts`
  - [ ] 3.2.1 Keep existing `HttpRatesOptions` interface with real properties
  - [ ] 3.2.2 Add import for `AdapterConfig` from core types
  - [ ] 3.2.3 Add import for `CURRENCY_RATES_TOKEN` from port token file
  - [ ] 3.2.4 Add import for `CurrencyRatesPort` from port file
  - [ ] 3.2.5 Add export: `export type HttpRatesAdapterConfig = AdapterConfig<typeof CURRENCY_RATES_TOKEN, CurrencyRatesPort>`
- [ ] 3.3 Update `examples/rates/adapters/http/http-rates.adapter.ts`
  - [ ] 3.3.1 Use `@Adapter<HttpRatesAdapterConfig>` pattern
  - [ ] 3.3.2 Import `HttpRatesAdapterConfig` type from `./http-rates.types`
- [ ] 3.4 Check for and update `examples/rates/adapters/mock/` if exists
  - [ ] 3.4.1 Create `mock-rates.types.ts` with `MockRatesAdapterConfig`
  - [ ] 3.4.2 Update mock adapter to use generic type parameter

## 4. Update Documentation
- [ ] 4.1 Search and update all files in `docs/` folder
  - [ ] 4.1.1 Find all adapter code examples
  - [ ] 4.1.2 Update adapter types files to export AdapterConfig
  - [ ] 4.1.3 Update adapter decorators to use generic pattern
  - [ ] 4.1.4 Add explanation of type safety benefits
- [ ] 4.2 Update `README.md`
  - [ ] 4.2.1 Update quick start examples to show AdapterConfig pattern
  - [ ] 4.2.2 Update adapter creation examples showing types file with AdapterConfig
  - [ ] 4.2.3 Show import pattern from adapter's own types file

## 5. Testing
- [ ] 5.1 Generate test adapter with CLI and verify output
  - [ ] 5.1.1 Verify `{name}.types.ts` includes AdapterConfig export
  - [ ] 5.1.2 Check adapter uses `@Adapter<{Name}AdapterConfig>` pattern
  - [ ] 5.1.3 Verify imports are from adapter's own types file
  - [ ] 5.1.4 Verify types file imports port token and interface correctly
  - [ ] 5.1.5 Run `tsc` to ensure no type errors
- [ ] 5.2 Run full test suite
  - [ ] 5.2.1 `bun test`
  - [ ] 5.2.2 `bun run lint`
  - [ ] 5.2.3 `tsc`

## 6. Validation
- [ ] 6.1 Verify generated code matches examples exactly
- [ ] 6.2 Ensure backward compatibility (old adapters still work)
- [ ] 6.3 Check all documentation is consistent
- [ ] 6.4 Run `bun run lint && bun run type-check`
