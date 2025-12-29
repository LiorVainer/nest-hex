/**
 * Confirm Component
 *
 * Interactive yes/no confirmation prompt.
 */

import { Select } from '@inkjs/ui'
import { Box, Text } from 'ink'
import React from 'react'

export interface ConfirmProps {
	message: string
	defaultValue?: boolean
	onSubmit: (confirmed: boolean) => void
}

/**
 * Yes/no confirmation prompt.
 */
export function Confirm({
	message,
	defaultValue = true,
	onSubmit,
}: ConfirmProps) {
	const options = [
		{ label: 'Yes', value: 'yes' },
		{ label: 'No', value: 'no' },
	]

	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text>{message}</Text>
			</Box>

			<Select
				options={options}
				defaultValue={defaultValue ? 'yes' : 'no'}
				onChange={(value) => onSubmit(value === 'yes')}
			/>
		</Box>
	)
}
