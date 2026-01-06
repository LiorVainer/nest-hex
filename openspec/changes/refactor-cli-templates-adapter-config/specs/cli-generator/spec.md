# CLI Generator Capability - AdapterConfig Type Safety

## MODIFIED Requirements

### Requirement: Adapter Generation

The CLI SHALL generate adapter implementations for existing or new ports using type-safe AdapterConfig generic parameters.

#### Scenario: Generate adapter for existing port
- **WHEN** user runs `npx nest-hex generate adapter S3 --port ObjectStorage`
- **THEN** CLI creates `adapters/s3/s3.adapter.ts` with `@Adapter<S3AdapterConfig>` decorator
- **AND** adapter imports `S3AdapterConfig` type from its own types file (`./s3.types`)
- **AND** adapter class is named `S3Adapter`
- **AND** CLI creates `adapters/s3/s3.service.ts` implementing port interface
- **AND** CLI creates `adapters/s3/s3.types.ts` with:
  - Options interface (e.g., `S3ConfigOptions`)
  - AdapterConfig type export: `export type S3AdapterConfig = AdapterConfig<ObjectStorageToken, ObjectStoragePort>`
  - Import for `AdapterConfig` from core types
  - Import for `ObjectStorageToken` from port token file
  - Import for `ObjectStoragePort` from port interface file
- **AND** adapter imports token from existing port token file
- **AND** adapter extends AdapterBase<S3ConfigOptions>
- **AND** @Adapter decorator uses generic type parameter for full type safety

#### Scenario: Generate adapter without existing port
- **WHEN** user runs `npx nest-hex generate adapter HTTP` without `--port` flag
- **THEN** CLI prompts: "Which port does this adapter implement?"
- **AND** CLI shows list of detected ports in project
- **AND** user can select from list or enter custom port name

#### Scenario: Generate adapter with async configuration
- **WHEN** user generates adapter
- **THEN** adapter includes both register() and registerAsync() support via base class
- **AND** generated service has proper dependency injection setup
- **AND** adapter uses AdapterConfig type for compile-time safety

#### Scenario: AdapterConfig type resolution
- **WHEN** user generates adapter named "S3" for port "ObjectStorage"
- **THEN** CLI creates `S3AdapterConfig` type in `s3.types.ts`
- **AND** adapter file imports this type: `import type { S3AdapterConfig } from './s3.types'`
- **AND** adapter decorator uses it: `@Adapter<S3AdapterConfig>({...})`
- **AND** TypeScript compiler verifies portToken and implementation match the config

### Requirement: Template System

The CLI SHALL use templates for file generation with support for customization, including AdapterConfig type generation.

#### Scenario: Use default templates
- **WHEN** user generates components without custom templates
- **THEN** CLI uses built-in Handlebars templates from `src/cli/templates/`
- **AND** templates render with correct variables (name, paths, style)
- **AND** generated code matches library examples with AdapterConfig pattern
- **AND** adapter types templates include AdapterConfig type export
- **AND** adapter templates use generic type parameter on @Adapter

#### Scenario: Use custom templates
- **WHEN** user configures custom template in config: `templates.portModule = './custom/port.hbs'`
- **AND** user generates port
- **THEN** CLI loads custom template from specified path
- **AND** CLI renders custom template with standard variables
- **AND** CLI generates file using custom template

#### Scenario: Template variable injection
- **WHEN** CLI renders any template
- **THEN** template receives name in all cases: pascal, camel, kebab, snake, screamingSnake
- **AND** template receives import paths relative to output file
- **AND** template receives style preferences: indent, quote, semi
- **AND** template receives metadata: timestamp, author (from git)
- **AND** template receives port interface name for AdapterConfig type
- **AND** template receives correct import path for AdapterConfig from core types

### Requirement: Template Examples and Documentation

The CLI SHALL generate templates with helpful example comments and properties to guide developers.

#### Scenario: Port interface includes example methods
- **WHEN** user generates a port
- **THEN** CLI creates port interface file with commented example method signatures
- **AND** examples show common patterns like `get{Entity}(id: string): Promise<{Entity}>`
- **AND** examples show create patterns like `create{Entity}(data: Dto): Promise<{Entity}>`
- **AND** comments indicate "uncomment and modify as needed"

#### Scenario: Adapter options include example properties
- **WHEN** user generates an adapter
- **THEN** CLI creates types file with options interface
- **AND** options interface includes commented example properties
- **AND** examples show common config patterns: `apiUrl?: string`, `apiKey?: string`, `timeout?: number`
- **AND** comments indicate "modify as needed"

#### Scenario: Generated examples are contextually relevant
- **WHEN** templates include example comments
- **THEN** examples use the entity/port name in placeholders (e.g., for "ObjectStorage" port, show `getObject`, `createObject`)
- **AND** examples match the domain language of the port

### Requirement: Code Quality of Generated Files

The CLI SHALL generate code that passes all project quality checks and uses proper type safety patterns.

#### Scenario: TypeScript compilation
- **WHEN** CLI generates any files
- **THEN** generated code compiles without errors with `tsc --noEmit`
- **AND** generated code passes `isolatedDeclarations` check
- **AND** generated code has no type assertions (`as`) unless necessary
- **AND** AdapterConfig types are properly exported and imported
- **AND** @Adapter generic parameter matches exported AdapterConfig type

#### Scenario: Linting
- **WHEN** CLI generates files
- **THEN** generated code passes Biome checks
- **AND** generated code uses tabs for indentation (per project config)
- **AND** generated code uses single quotes
- **AND** generated code has consistent formatting

#### Scenario: Decorator usage
- **WHEN** CLI generates port or adapter
- **THEN** generated code uses correct decorator imports from library
- **AND** decorators have proper metadata (@Adapter, @InjectPort)
- **AND** @Adapter decorator includes generic type parameter when applicable
- **AND** reflect-metadata is assumed available (peer dependency)
