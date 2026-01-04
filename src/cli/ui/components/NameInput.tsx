/**
 * Name Input Component
 *
 * Interactive name input with tab-completion for placeholder suggestions.
 */

import { Box, Text, useInput } from 'ink'
import TextInput from 'ink-text-input'
import { useState } from 'react'
import { CustomBadge } from './CustomBadge'

export interface NameInputProps {
	type: 'port' | 'adapter' | 'service' | 'full'
	step?: 'port' | 'adapter' // For 'full' type, which name we're asking for
	portName?: string // For displaying port name when asking for adapter name
	onSubmit: (name: string) => void
}

/**
 * Name input for component generation.
 */
export function NameInput({
	type,
	step,
	portName,
	onSubmit,
}: NameInputProps): JSX.Element {
	// Track current input value for Tab key handling
	const [currentValue, setCurrentValue] = useState('')
	// Track if we just filled via Tab (to force cursor to end)
	const [justFilled, setJustFilled] = useState(false)

	// Determine placeholder based on type and step
	const getPlaceholder = () => {
		if (type === 'full') {
			const currentStep = step || 'port'
			if (currentStep === 'adapter') {
				return portName ? `${portName}Implementation` : 'S3'
			}
			return 'ObjectStorage'
		}

		const placeholders = {
			port: 'ObjectStorage',
			adapter: 'S3',
			service: 'FileUpload',
			full: '',
		}
		return placeholders[type]
	}

	const placeholder = getPlaceholder()

	// Handle Tab key to fill placeholder (hook must be at top level)
	useInput((_input, key) => {
		if (key.tab && !currentValue) {
			setCurrentValue(placeholder)
			setJustFilled(true)
			// Reset justFilled after a brief moment
			setTimeout(() => setJustFilled(false), 10)
		}
	})

	// For 'full' type, show different prompts based on the step
	if (type === 'full') {
		const currentStep = step || 'port'
		const labels = {
			port: 'Enter the PORT name',
			adapter: 'Enter the ADAPTER name',
		}

		return (
			<Box flexDirection="column">
				{/* Show port name badge when asking for adapter name */}
				{currentStep === 'adapter' && portName && (
					<Box>
						<CustomBadge color="blue">Port: {portName}</CustomBadge>
					</Box>
				)}

				<Box paddingX={1} marginBottom={1}>
					<Text bold color="cyan">
						{labels[currentStep]}:
					</Text>
				</Box>

				<Box
					borderTop
					borderBottom
					borderLeft={false}
					borderRight={false}
					borderStyle="single"
					borderColor="gray"
					paddingX={1}
				>
					<TextInput
						key={`${currentStep}-${justFilled}`} // Force re-render to reset cursor
						value={currentValue}
						placeholder={placeholder}
						onChange={setCurrentValue}
						onSubmit={() => {
							if (currentValue.trim()) {
								onSubmit(currentValue.trim())
								setCurrentValue('') // Clear after submit
							}
						}}
					/>
				</Box>

				<Box paddingX={1}>
					<Text dimColor>
						Press Tab to use suggestion • Press Ctrl+Q to go back
					</Text>
				</Box>
			</Box>
		)
	}

	return (
		<Box flexDirection="column">
			<Box paddingX={1} marginBottom={1}>
				<Text bold color="cyan">
					Enter the name for your {type}:
				</Text>
			</Box>

			<Box
				borderTop
				borderBottom
				borderLeft={false}
				borderRight={false}
				borderStyle="single"
				borderColor="gray"
				paddingX={1}
			>
				<TextInput
					key={`${type}-${justFilled}`} // Force re-render to reset cursor
					value={currentValue}
					placeholder={placeholder}
					onChange={setCurrentValue}
					onSubmit={() => {
						if (currentValue.trim()) {
							onSubmit(currentValue.trim())
							setCurrentValue('') // Clear after submit
						}
					}}
				/>
			</Box>

			<Box paddingX={1}>
				<Text dimColor>
					Press Tab to use suggestion • Press Ctrl+Q to go back
					{type === 'adapter' && ' to port selection'}
				</Text>
			</Box>
		</Box>
	)
}
