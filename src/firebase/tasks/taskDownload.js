import { loadTasksByMonth } from './taskQueries';
import { MONTH_NAMES, generateFilename, triggerDownload } from './downloadUtils';
import { tasksToCSV, tasksToFormattedCSV } from './csvConverter';

/**
 * Download tasks for a specific month as JSON
 * @param {string} userEmail - The current user's email
 * @param {number} year - The year (e.g., 2024)
 * @param {number} month - The month (1-12)
 * @returns {Promise<{ success: boolean, error?: string, filename?: string, taskCount?: number }>}
 */
export const downloadTasksByMonthAsJSON = async (userEmail, year, month) => {
	try {
		if (!userEmail) {
			return { success: false, error: 'User email is required' };
		}

		const result = await loadTasksByMonth(userEmail, year, month);

		if (!result.success) {
			return { success: false, error: result.error };
		}

		const filename = generateFilename(year, month, 'json');
		const exportData = {
			exportDate: new Date().toISOString(),
			month: MONTH_NAMES[month - 1],
			year,
			totalTasks: result.tasks.length,
			tasks: result.tasks,
		};

		const content = JSON.stringify(exportData, null, 2);
		triggerDownload(content, filename, 'application/json');

		return {
			success: true,
			filename,
			taskCount: result.tasks.length,
		};
	} catch (error) {
		console.error('Error downloading tasks as JSON:', error);
		return {
			success: false,
			error: error.message || 'Failed to download tasks',
		};
	}
};

/**
 * Download tasks for a specific month as CSV
 * @param {string} userEmail - The current user's email
 * @param {number} year - The year (e.g., 2024)
 * @param {number} month - The month (1-12)
 * @param {boolean} formatted - Whether to use formatted (readable) dates
 * @returns {Promise<{ success: boolean, error?: string, filename?: string, taskCount?: number }>}
 */
export const downloadTasksByMonthAsCSV = async (userEmail, year, month, formatted = true) => {
	try {
		if (!userEmail) {
			return { success: false, error: 'User email is required' };
		}

		const result = await loadTasksByMonth(userEmail, year, month);

		if (!result.success) {
			return { success: false, error: result.error };
		}

		const filename = generateFilename(year, month, 'csv');
		const content = formatted ? tasksToFormattedCSV(result.tasks) : tasksToCSV(result.tasks);

		triggerDownload(content, filename, 'text/csv;charset=utf-8');

		return {
			success: true,
			filename,
			taskCount: result.tasks.length,
		};
	} catch (error) {
		console.error('Error downloading tasks as CSV:', error);
		return {
			success: false,
			error: error.message || 'Failed to download tasks',
		};
	}
};

/**
 * Download tasks for the current month as JSON
 * @param {string} userEmail - The current user's email
 * @returns {Promise<{ success: boolean, error?: string, filename?: string, taskCount?: number }>}
 */
export const downloadCurrentMonthTasksAsJSON = async (userEmail) => {
	if (!userEmail) {
		return { success: false, error: 'User email is required' };
	}

	const now = new Date();
	return downloadTasksByMonthAsJSON(userEmail, now.getFullYear(), now.getMonth() + 1);
};

/**
 * Download tasks for the current month as CSV
 * @param {string} userEmail - The current user's email
 * @param {boolean} formatted - Whether to use formatted (readable) dates
 * @returns {Promise<{ success: boolean, error?: string, filename?: string, taskCount?: number }>}
 */
export const downloadCurrentMonthTasksAsCSV = async (userEmail, formatted = true) => {
	if (!userEmail) {
		return { success: false, error: 'User email is required' };
	}

	const now = new Date();
	return downloadTasksByMonthAsCSV(userEmail, now.getFullYear(), now.getMonth() + 1, formatted);
};

/**
 * Download tasks for a specific month with format selection
 * @param {string} userEmail - The current user's email
 * @param {number} year - The year (e.g., 2024)
 * @param {number} month - The month (1-12)
 * @param {'json' | 'csv'} format - Download format
 * @param {boolean} formattedDates - Whether to use formatted dates (CSV only)
 * @returns {Promise<{ success: boolean, error?: string, filename?: string, taskCount?: number }>}
 */
export const downloadTasksByMonth = async (
	userEmail,
	year,
	month,
	format = 'json',
	formattedDates = true
) => {
	if (!userEmail) {
		return { success: false, error: 'User email is required' };
	}

	if (format === 'csv') {
		return downloadTasksByMonthAsCSV(userEmail, year, month, formattedDates);
	}
	return downloadTasksByMonthAsJSON(userEmail, year, month);
};
