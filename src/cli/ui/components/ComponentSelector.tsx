/**
 * Component Selector
 *
 * Interactive multi-select for choosing which components to generate.
 */

import { MultiSelect } from '@inkjs/ui'
import { Box, Text } from 'ink'
import { useState } from 'react'

export interface ComponentOption {
	value: string
	label: string
	description?: string
}

export interface ComponentSelectorProps {
	options: ComponentOption[]
	onSubmit: (selected: string[]) => void
	title?: string
}

/**
 * Multi-select component for choosing which components to generate.
 */
export function ComponentSelector({
	options,
	onSubmit,
	title,
}: ComponentSelectorProps): JSX.Element {
	const [selected, setSelected] = useState<string[]>([])

	return (
		<Box flexDirection="column">
			{title && (
				<Box marginBottom={1}>
					<Text bold>{title}</Text>
				</Box>
			)}

			<MultiSelect
				options={options.map((opt) => ({
					label: opt.label,
					value: opt.value,
				}))}
				onChange={(values) => setSelected(values)}
				onSubmit={() => onSubmit(selected)}
			/>

			<Box marginTop={1}>
				<Text dimColor>
					Use <Text bold>space</Text> to select, <Text bold>enter</Text> to
					confirm
				</Text>
			</Box>
		</Box>
	)
}
