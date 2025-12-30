import { defineConfig } from 'bunup'

// Only build the main library with bunup
// CLI will be built separately or run with tsx/bun directly
const config: ReturnType<typeof defineConfig> = defineConfig({
	entry: 'src/index.ts',
	outDir: 'dist',
	format: 'cjs',
	dts: true,
	clean: true,
})

export default config
