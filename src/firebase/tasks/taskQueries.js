import { collection, getDocs, query, orderBy, limit, startAfter, where } from 'firebase/firestore';
import { db } from '../config';
import { TASKS_COLLECTION, ITEMS_LIMIT } from './constants';
import { mapDocumentToTask } from './taskMapper';
import { getFirestoreErrorMessage } from './errorHandler';

/**
 * Get the start and end dates for a given month
 * @param {number} year - The year (e.g., 2024)
 * @param {number} month - The month (1-12)
 * @returns {{ startDate: string, endDate: string }} ISO date strings for the month range
 */
const getMonthDateRange = (year, month) => {
	const startDate = new Date(year, month - 1, 1);
	const endDate = new Date(year, month, 0, 23, 59, 59, 999);
	return {
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
	};
};

export const loadTasks = async (lastId = null) => {
	try {
		const q = query(
			collection(db, TASKS_COLLECTION),
			orderBy('id', 'desc'),
			...(lastId ? [startAfter(lastId)] : []),
			limit(ITEMS_LIMIT)
		);

		const snapshot = await getDocs(q);
		const tasks = snapshot.docs.map(mapDocumentToTask).filter(Boolean);
		const newLastId = tasks.length > 0 ? tasks[tasks.length - 1].id : null;

		return {
			success: true,
			tasks,
			lastId: newLastId,
			canLoadMore: tasks.length === ITEMS_LIMIT,
		};
	} catch (error) {
		console.error('Error loading tasks:', error);
		return {
			success: false,
			error: getFirestoreErrorMessage(error),
		};
	}
};

/**
 * Load all tasks for a specific month
 * @param {number} year - The year (e.g., 2024)
 * @param {number} month - The month (1-12, where 1 = January)
 * @returns {Promise<{ success: boolean, tasks?: Array, error?: string, totalCount?: number }>}
 */
export const loadTasksByMonth = async (year, month) => {
	try {
		// Validate inputs
		if (!year || !month || month < 1 || month > 12) {
			return {
				success: false,
				error: 'Invalid year or month. Month should be between 1 and 12.',
			};
		}

		const { startDate, endDate } = getMonthDateRange(year, month);

		// Query tasks where startTime falls within the month range
		const q = query(
			collection(db, TASKS_COLLECTION),
			where('startTime', '>=', startDate),
			where('startTime', '<=', endDate),
			orderBy('startTime', 'asc')
		);

		const snapshot = await getDocs(q);
		const tasks = snapshot.docs.map(mapDocumentToTask).filter(Boolean);

		return {
			success: true,
			tasks,
			totalCount: tasks.length,
			month,
			year,
		};
	} catch (error) {
		console.error('Error loading tasks by month:', error);
		return {
			success: false,
			error: getFirestoreErrorMessage(error),
		};
	}
};

/**
 * Load all tasks for the current month
 * @returns {Promise<{ success: boolean, tasks?: Array, error?: string, totalCount?: number }>}
 */
export const loadTasksCurrentMonth = async () => {
	const now = new Date();
	return loadTasksByMonth(now.getFullYear(), now.getMonth() + 1);
};
