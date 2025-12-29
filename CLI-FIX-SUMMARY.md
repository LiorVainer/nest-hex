# CLI Import Path Fix

## Issues Fixed

### Issue 1: Separate Import Files
The CLI was generating separate imports for token and interface.

### Issue 2: Wrong Token Name
Using adapter name (`OBJECT_IMPL_PORT`) instead of port name (`OBJECT_PORT`).

### Issue 3: Wrong Import Path
Using adapter name in path (`object-impl`) instead of port name (`object`).

### Issue 4: Wrong Path Depth
Using `../../../` instead of `../../` due to nested directory structure.

**Before (Wrong):**
```typescript
// adapter.ts - Generated for "object-impl" adapter
import { OBJECT_IMPL_PORT } from '../../../ports/object-impl'

// service.ts
import type { ObjectImplPort } from '../../../ports/object-impl'

@Port({
  token: OBJECT_IMPL_PORT,  // Wrong! Using adapter name
  implementation: ObjectImplService,
})
```

**After (Correct):**
```typescript
// adapter.ts - Generated for "object-impl" adapter with --port object
import { OBJECT_PORT } from '../../ports/object'

// service.ts
import type { ObjectPort } from '../../ports/object'

@Port({
  token: OBJECT_PORT,  // Correct! Using port name
  implementation: ObjectImplService,
})
```

## Root Cause

The adapter generator (`src/cli/generators/adapter.generator.ts`) was creating separate import paths for:
- Token: `portTokenImport` pointing to `{port}/{port}.token`
- Interface: `portInterfaceImport` pointing to `{port}/{port}.port`

But the port generator already creates an `index.ts` file that exports both the token and interface together.

## Solution

### 1. Updated `adapter.generator.ts` (lines 56-72)

Changed from separate imports:
```typescript
portTokenImport: options.portPath || `../../${portName}/${portName}.token`,
portInterfaceImport: options.portPath || `../../${portName}/${portName}.port`,
```

To a unified import path:
```typescript
portImportPath: options.portPath || `../../../${portsDir}/${portName}`,
```

### 2. Updated Templates

**`src/cli/templates/adapter/adapter.hbs` (line 14):**
```handlebars
// Before
import { {{portTokenName}} } from '{{portTokenImport}}'

// After
import { {{portTokenName}} } from '{{portImportPath}}'
```

**`src/cli/templates/adapter/service.hbs` (line 8):**
```handlebars
// Before
import type { {{portInterfaceName}} } from '{{portInterfaceImport}}'

// After
import type { {{portInterfaceName}} } from '{{portImportPath}}'
```

## Default Path Structure

The CLI now generates a **flat adapter structure** for consistent import paths:

```
src/
├── ports/
│   └── object/            # Port directory
│       ├── object.port.ts   # Interface definition
│       ├── object.token.ts  # Token definition
│       ├── object.service.ts # Domain service (optional)
│       └── index.ts         # Exports all (token + interface)
│
└── adapters/
    └── object-impl/       # FLAT structure - not nested
        ├── object-impl.adapter.ts   # Imports from '../../ports/object'
        ├── object-impl.service.ts   # Imports from '../../ports/object'
        └── object-impl.types.ts
```

## Path Calculation

From adapter location to port (flat structure):
- Adapter: `src/adapters/object-impl/object-impl.adapter.ts`
- Port: `src/ports/object/index.ts`
- Relative path: `../../ports/object` ✅

**Previous nested structure (removed):**
- ❌ `src/adapters/object/object-impl/` (required `../../../`)
- ✅ `src/adapters/object-impl/` (requires `../../`)

## Benefits

1. **Single Source of Truth**: Both token and interface imported from one location
2. **Cleaner Imports**: No need for separate import statements
3. **Better DX**: Matches the port's index.ts export structure
4. **Configurable**: Uses `config.output.portsDir` to respect custom configurations
5. **Consistent**: All port-related imports use the same pattern

## Testing

To test the fix:

```bash
# Generate a port
bun run cli generate port nice

# Generate an adapter for that port
bun run cli generate adapter nice-very --port nice

# Check the generated imports
cat src/adapters/nice/nice-very/nice-very.adapter.ts
# Should show: import { NICE_PORT } from '../../../ports/nice'
```

## Breaking Changes

None - this is a fix for the CLI generator. Existing hand-written code is unaffected.

## Files Changed

1. **`src/cli/generators/adapter.generator.ts`**
   - Line 67-69: Changed path from `../../../ports/{port}` to `../../ports/{port}`
   - Line 81-84: Removed nested directory structure (was `adapters/{port}/{adapter}/`)
   - Now uses flat structure: `adapters/{adapter}/`

2. **`src/cli/templates/adapter/adapter.hbs`**
   - Line 14-16: Only generate port import if `portTokenName` exists
   - Line 41-46: Only generate `@Port` decorator if `portTokenName` exists
   - Removed fallback to adapter name

3. **`src/cli/templates/adapter/service.hbs`**
   - Line 8-10: Only generate port interface import if `portInterfaceName` exists
   - Line 17: Only implement interface if `portInterfaceName` exists
   - Removed fallback to adapter name

## Key Changes

### 1. Flat Directory Structure
**Before:** `src/adapters/{portName}/{adapterName}/`
**After:** `src/adapters/{adapterName}/`

This makes all adapter imports use `../../ports/{portName}` consistently.

### 2. No Fallback to Adapter Name
**Before:** If no port specified, used adapter name for token/path
**After:** If no port specified, don't generate port imports at all

This prevents confusing imports like `OBJECT_IMPL_PORT` from `object-impl`.

### 3. Conditional Generation
Port-related code is only generated when `--port` flag is provided:
- Import statements
- `@Port` decorator
- Interface implementation

## Usage

```bash
# Generate a port first
nest-hex generate port object

# Generate an adapter FOR that port
nest-hex generate adapter object-impl --port object

# Result:
# ✅ import { OBJECT_PORT } from '../../ports/object'
# ✅ @Port({ token: OBJECT_PORT, ... })
```

All changes improve code quality and prevent user confusion!
