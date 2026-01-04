/**
 * Custom Badge Component
 *
 * Badge component with white text for better contrast.
 * Wraps Ink's Box and Text to create a badge with customizable background color.
 */

import { Box, Text } from 'ink'
import type { ReactNode } from 'react'

export interface CustomBadgeProps {
	color: 'blue' | 'green' | 'cyan' | 'red' | 'yellow'
	children: ReactNode
}

/**
 * Badge component with white text and colored background.
 */
export function CustomBadge({
	color,
	children,
}: CustomBadgeProps): JSX.Element {
	return (
		<Box paddingX={1}>
			<Text backgroundColor={color} color="white" bold>
				{children}
			</Text>
		</Box>
	)
}
