/**
 * Month names for formatting
 */
export const MONTH_NAMES = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

/**
 * Generate a filename for the download
 * @param {number} year - The year
 * @param {number} month - The month (1-12)
 * @param {string} extension - File extension (json or csv)
 * @returns {string} Filename
 */
export const generateFilename = (year, month, extension) => {
	const monthName = MONTH_NAMES[month - 1];
	return `tasks_${monthName}_${year}.${extension}`;
};

/**
 * Trigger a file download in the browser
 * @param {string} content - File content
 * @param {string} filename - Filename for the download
 * @param {string} mimeType - MIME type of the file
 */
export const triggerDownload = (content, filename, mimeType) => {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};
