export function stripANSIEscapeCodes(input: string): string {
	// This regular expression matches ANSI escape codes
	const ansiEscapeCodeRegex = /\x1B\[([0-9;]*[mK])/g;

	// Replace ANSI escape codes with an empty string
	const cleanedString = input.replace(ansiEscapeCodeRegex, "");

	return cleanedString;
}
