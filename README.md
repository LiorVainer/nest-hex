# nest-hex

> A tiny, **class-based**, **NestJS-native** helper library for building **pluggable adapters** following the Ports & Adapters (Hexagonal Architecture) pattern with minimal boilerplate and great developer experience.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why Hexagonal Architecture?

**Hexagonal Architecture (Ports & Adapters)** is a powerful pattern for building maintainable, testable, and adaptable applications. Here's why it matters:

### 🎯 Keep Domain Logic Pure
Your business logic should never depend on infrastructure details like databases, APIs, or file systems. By defining **ports** (interfaces), your domain layer stays clean and focused on what matters: solving business problems.

### 🔌 Pluggable Infrastructure
Need to switch from AWS S3 to Google Cloud Storage? Replace MongoDB with PostgreSQL? Change from REST to GraphQL? With hexagonal architecture, you just swap the **adapter** – your domain logic never changes.

### 🧪 Effortless Testing
Mock external services by creating test adapters. No complex setup, no database connections, no API calls. Just simple, fast unit tests that focus on business logic.

### 🌍 Environment Flexibility
- **Development**: Use filesystem storage
- **Testing**: Use in-memory mocks
- **Production**: Use AWS S3

Same domain code, different adapters. Configure once, swap anywhere.

### 📦 Independent Deployment
Infrastructure changes don't require redeploying your entire application. Update an adapter independently without touching core business logic.

## Why This Library?

Building NestJS applications with the Ports & Adapters pattern involves repetitive boilerplate:

- Registering concrete implementation classes
- Aliasing port tokens to implementations (`useExisting`)
- Exporting only the port token (not provider objects)
- Supporting both `register()` and `registerAsync()` patterns
- Keeping the app responsible for configuration (no `process.env` in libraries)

**nest-hex eliminates this boilerplate** while maintaining compile-time type safety and providing a delightful developer experience through both decorators and a powerful CLI.

## Features

- 🎯 **Declarative**: Declare port tokens and implementations once using `@Port({ token, implementation })`
- 🏗️ **Class-based**: Use standard NestJS dynamic modules, no function factories required
- 🔒 **Type-safe**: `AdapterModule<TToken>` carries compile-time proof of which token it provides
- ⚡ **Zero runtime overhead**: Uses TypeScript decorators and metadata, minimal abstraction
- 📦 **Tiny**: Core library is under 1KB minified
- 🧪 **Testable**: Easily mock adapters for testing
- 🛠️ **Powerful CLI**: Generate ports, adapters, and services with a single command

## CLI

**nest-hex** includes a powerful CLI to scaffold ports, adapters, and services instantly. No more manual file creation!

### Quick Start

```bash
# Initialize configuration
npx nest-hex init

# Generate a port (domain interface)
npx nest-hex generate port ObjectStorage

# Generate an adapter for the port
npx nest-hex generate adapter S3 --port ObjectStorage

# Generate both port and adapter together
npx nest-hex generate full ObjectStorage S3

# Generate a service that uses a port
npx nest-hex generate service FileUpload
```

### Available Commands

#### `init`
Create a `nest-hex.config.ts` configuration file in your project.

```bash
npx nest-hex init
```

#### `generate` (or `g`)
Generate ports, adapters, services, or complete modules.

```bash
# Generate a port
npx nest-hex generate port <name>
npx nest-hex g port PaymentGateway

# Generate an adapter
npx nest-hex generate adapter <name> --port <portName>
npx nest-hex g adapter Stripe --port PaymentGateway

# Generate both port and adapter
npx nest-hex generate full <portName> <adapterName>
npx nest-hex g full EmailService SendGrid

# Generate a service
npx nest-hex generate service <name>
npx nest-hex g service UserRegistration
```

### Interactive Mode

Run commands without arguments for interactive prompts:

```bash
npx nest-hex generate
# → Select type: port, adapter, service, or full
# → Enter name(s)
# → Files generated!
```

### Configuration

The CLI uses `nest-hex.config.ts` to customize output paths and naming conventions:

```typescript
// nest-hex.config.ts
import { defineConfig } from 'nest-hex/cli';

export default defineConfig({
  output: {
    portsDir: 'src/domain/ports',      // Where to generate ports
    adaptersDir: 'src/infrastructure', // Where to generate adapters
    servicesDir: 'src/application',    // Where to generate services
  },
  naming: {
    portSuffix: 'Port',     // ObjectStoragePort
    tokenSuffix: '_PORT',   // OBJECT_STORAGE_PORT
    adapterSuffix: 'Adapter', // S3Adapter
    serviceSuffix: 'Service', // FileUploadService
  },
});
```

### What Gets Generated

#### Port Generation
Creates a complete port with:
- Token definition (`OBJECT_STORAGE_PORT`)
- TypeScript interface with example methods
- Service implementation with `@InjectPort`
- Module that accepts adapters
- Barrel exports (`index.ts`)

#### Adapter Generation
Creates a production-ready adapter with:
- Implementation service class
- Options interface
- Adapter class with `@Port` decorator
- Complete TypeScript types
- Barrel exports

#### Service Generation
Creates a domain service with:
- Service class with `@InjectPort` usage
- Type-safe port injection
- Example business logic methods

### CLI Benefits

✅ **Instant scaffolding** - Generate complete, type-safe modules in seconds
✅ **Consistent structure** - All team members follow the same patterns
✅ **Best practices built-in** - Generated code follows hexagonal architecture principles
✅ **Customizable** - Configure paths and naming to match your project
✅ **Interactive** - Friendly prompts guide you through generation

## Installation

```bash
npm install nest-hex
# or
yarn add nest-hex
# or
pnpm add nest-hex
# or
bun add nest-hex
```

### Peer Dependencies

```bash
npm install @nestjs/common @nestjs/core reflect-metadata
```

## Quick Start

### 1. Define a Port (Domain Interface)

```typescript
// storage.port.ts
export const STORAGE_PORT = Symbol('STORAGE_PORT');

export interface StoragePort {
  upload(file: Buffer, key: string): Promise<{ url: string }>;
  download(key: string): Promise<Buffer>;
}
```

### 2. Create an Adapter (Infrastructure Implementation)

```typescript
// s3.adapter.ts
import { Injectable } from '@nestjs/common';
import { Adapter, Port } from 'nest-hex';
import { STORAGE_PORT, type StoragePort } from './storage.port';

// Implementation service
@Injectable()
class S3StorageService implements StoragePort {
  async upload(file: Buffer, key: string) {
    // AWS S3 upload logic here
    return { url: `https://s3.amazonaws.com/bucket/${key}` };
  }

  async download(key: string) {
    // AWS S3 download logic here
    return Buffer.from('file contents');
  }
}

// Adapter configuration
interface S3Options {
  bucket: string;
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

// Adapter module - single decorator declares everything!
@Port({
  token: STORAGE_PORT,
  implementation: S3StorageService,
})
export class S3Adapter extends Adapter<S3Options> {}
```

### 3. Create a Port Module (Domain Service)

```typescript
// storage.module.ts
import { Injectable, Module } from '@nestjs/common';
import { InjectPort, PortModule } from 'nest-hex';
import { STORAGE_PORT, type StoragePort } from './storage.port';

// Domain service that uses the port
@Injectable()
export class StorageService {
  constructor(
    @InjectPort(STORAGE_PORT)
    private readonly storage: StoragePort,
  ) {}

  async uploadUserAvatar(userId: string, image: Buffer) {
    const key = `avatars/${userId}.jpg`;
    return this.storage.upload(image, key);
  }

  async downloadUserAvatar(userId: string) {
    const key = `avatars/${userId}.jpg`;
    return this.storage.download(key);
  }
}

// Port module that accepts any adapter
@Module({})
export class StorageModule extends PortModule<typeof StorageService> {}
```

### 4. Wire It Up in Your App

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { StorageModule } from './storage/storage.module';
import S3Adapter from './storage/adapters/s3.adapter';

@Module({
  imports: [
    StorageModule.register({
      adapter: S3Adapter.register({
        bucket: 'my-app-uploads',
        region: 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }),
    }),
  ],
})
export class AppModule {}
```

That's it! You now have a fully type-safe, pluggable storage adapter. 🎉

## Key Benefits

### Before (Manual Boilerplate)

```typescript
// Lots of manual wiring...
@Module({})
export class S3StorageModule {
  static register(options: S3Options): DynamicModule {
    return {
      module: S3StorageModule,
      providers: [
        S3StorageService,
        { provide: STORAGE_PORT, useExisting: S3StorageService },
        // More boilerplate...
      ],
      exports: [STORAGE_PORT],
    };
  }
}
```

### After (With nest-hex)

```typescript
// Clean and declarative!
@Port({
  token: STORAGE_PORT,
  implementation: S3StorageService,
})
export class S3Adapter extends Adapter<S3Options> {}
```

## Advanced Usage

### Async Registration with Dependency Injection

```typescript
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    StorageModule.register({
      adapter: S3Adapter.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          bucket: config.get('S3_BUCKET'),
          region: config.get('AWS_REGION'),
          accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
          secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
        }),
      }),
    }),
  ],
})
export class AppModule {}
```

### Custom Imports and Extra Ports

```typescript
@Port({
  token: HTTP_CLIENT_PORT,
  implementation: AxiosHttpClient,
})
class AxiosAdapterClass extends Adapter<AxiosOptions> {
  protected override imports(options: AxiosOptions) {
    return [
      HttpModule.register({
        baseURL: options.baseUrl,
        timeout: options.timeout,
      }),
    ];
  }

  protected override extraPoviders(options: AxiosOptions) {
    return [
      {
        provide: 'HTTP_CLIENT_CONFIG',
        useValue: options,
      },
    ];
  }
}
```

### Swapping Adapters - The Power of Pluggability

**This is the core benefit of hexagonal architecture**: swap infrastructure without touching business logic.

#### Environment-Based Swapping

```typescript
// Development: Use filesystem storage
import FilesystemAdapter from './storage/adapters/filesystem.adapter';

// Production: Use AWS S3
import S3Adapter from './storage/adapters/s3.adapter';

const adapter = process.env.NODE_ENV === 'production'
  ? S3Adapter.register({ bucket: 'prod-bucket', region: 'us-east-1' })
  : FilesystemAdapter.register({ basePath: './uploads' });

@Module({
  imports: [
    StorageModule.register({ adapter }),
  ],
})
export class AppModule {}
```

#### Multi-Cloud Strategy

```typescript
// Easily switch cloud providers without changing domain code
const storageAdapter = process.env.CLOUD_PROVIDER === 'aws'
  ? S3Adapter.register({ bucket: 'my-bucket', region: 'us-east-1' })
  : process.env.CLOUD_PROVIDER === 'gcp'
  ? GCSAdapter.register({ bucket: 'my-bucket' })
  : AzureBlobAdapter.register({ containerName: 'my-container' });
```

#### Feature Flags

```typescript
// Gradually migrate to new infrastructure
const emailAdapter = featureFlags.useNewEmailProvider
  ? SendGridAdapter.register({ apiKey: process.env.SENDGRID_KEY })
  : SESAdapter.register({ region: 'us-east-1' });
```

#### Testing with Mocks

```typescript
// Test module: in-memory mock
const testAdapter = MockStorageAdapter.register();

// Production module: real infrastructure
const prodAdapter = S3Adapter.register({ bucket: 'prod' });

// Same domain code, different runtime behavior
```

**Key Point**: Your `StorageService` business logic **never changes**. Only the infrastructure adapter changes. This is the essence of maintainable architecture.

### Testing with Mock Adapters

```typescript
import { Adapter, Port } from 'nest-hex';

class MockStorageService {
  async upload(file: Buffer, key: string) {
    return { url: `mock://storage/${key}` };
  }

  async download(key: string) {
    return Buffer.from('mock file contents');
  }
}

@Port({
  token: STORAGE_PORT,
  implementation: MockStorageService,
})
export class MockStorageAdapter extends Adapter<void> {}

// Use in tests
const module = await Test.createTestingModule({
  imports: [
    StorageModule.register({
      adapter: MockStorageAdapter.register(undefined),
    }),
  ],
}).compile();
```

## API Reference

### Core Classes

#### `Adapter<TOptions>`

Abstract base class for building adapter modules.

**Methods:**
- `static register<TToken, TOptions>(options: TOptions): AdapterModule<TToken>` - Synchronous registration
- `static registerAsync<TToken, TOptions>(config: AsyncConfig): AdapterModule<TToken>` - Async registration with DI

**Protected Hooks:**
- `protected imports(options?: TOptions): unknown[]` - Override to import other NestJS modules
- `protected extraPoviders(options: TOptions): Port[]` - Override to add additional providers

#### `PortModule<TService>`

Abstract base class for building port modules that consume adapters.

**Methods:**
- `static register<TToken>({ adapter }: { adapter?: AdapterModule<TToken> }): DynamicModule`

### Decorators

#### `@Port({ token, implementation })`

Class decorator that declares which port token an adapter provides and its implementation class.

**Parameters:**
- `token: TToken` - The port token (usually a Symbol)
- `implementation: Type<unknown>` - The concrete implementation class

**Example:**
```typescript
@Port({
  token: STORAGE_PORT,
  implementation: S3StorageService,
})
class S3Adapter extends Adapter<S3Options> {}
```

#### `@InjectPort(token)`

Parameter decorator for injecting a port token into service constructors.

**Example:**
```typescript
constructor(
  @InjectPort(STORAGE_PORT)
  private readonly storage: StoragePort,
) {}
```

### Types

#### `AdapterModule<TToken>`

A DynamicModule that carries compile-time proof it provides `TToken`.

```typescript
type AdapterModule<TToken> = DynamicModule & {
  __provides: TToken;
};
```

## Best Practices

### ✅ Do's

- **Export port tokens, not provider objects**
  ```typescript
  exports: [STORAGE_PORT]  // ✅ Correct
  ```

- **Keep configuration in the app layer**
  ```typescript
  // ✅ Good: App provides config
  S3Adapter.register({
    bucket: process.env.S3_BUCKET,
  })
  ```

- **Use `@InjectPort` for clarity**
  ```typescript
  @InjectPort(STORAGE_PORT)  // ✅ Clear intent
  ```

- **Create small, focused adapters**
  - One adapter = one infrastructure concern

### ❌ Don'ts

- **Don't export provider objects**
  ```typescript
  exports: [{ provide: STORAGE_PORT, useExisting: S3Service }]  // ❌ Wrong
  ```

- **Don't use `process.env` in adapters**
  ```typescript
  // ❌ Bad: Config hard-coded in adapter
  class S3Adapter {
    bucket = process.env.S3_BUCKET;
  }
  ```

- **Don't mix domain logic with adapters**
  - Adapters = infrastructure only
  - Domain logic = port modules/services

## Examples

See the [`examples/`](./examples) directory for complete working examples:

- **Object Storage** - S3 adapter with file upload/download
- **Currency Rates** - HTTP API adapter with rate conversion
- **Basic Examples** - Decorator usage patterns

## Documentation

- 📖 [Full Specification](./spec/spec.md) - Complete implementation guide with AWS S3 and HTTP API examples
- 🔧 [API Reference](#api-reference) - Detailed API documentation

## License

MIT

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.
