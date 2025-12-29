/**
 * Summary Component
 *
 * Shows summary of generation results.
 */

import { Box, Text } from 'ink'
import React from 'react'

export interface SummaryProps {
	success: boolean
	filesGenerated: number
	totalFiles: number
	duration?: number
	outputPath?: string
	tips?: string[]
}

/**
 * Shows generation summary with file counts and helpful tips.
 */
export function Summary({
	success,
	filesGenerated,
	totalFiles,
	duration,
	outputPath,
	tips,
}: SummaryProps) {
	return (
		<Box flexDirection="column" paddingY={1}>
			<Box marginBottom={1}>
				{success ? (
					<Text color="green" bold>
						✅ Successfully generated {filesGenerated}/{totalFiles} files
						{duration ? ` in ${(duration / 1000).toFixed(1)}s` : ''}
					</Text>
				) : (
					<Text color="red" bold>
						❌ Generation failed
					</Text>
				)}
			</Box>

			{outputPath && (
				<Box marginBottom={1}>
					<Text dimColor>Output: {outputPath}</Text>
				</Box>
			)}

			{tips && tips.length > 0 && (
				<Box flexDirection="column" marginTop={1}>
					<Text bold>💡 Next steps:</Text>
					{tips.map((tip, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: For Cli UI only
						<Box key={index} marginLeft={2}>
							<Text>• {tip}</Text>
						</Box>
					))}
				</Box>
			)}
		</Box>
	)
}
