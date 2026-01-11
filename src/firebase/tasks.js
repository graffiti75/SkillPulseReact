import {
	collection,
	doc,
	getDocs,
	setDoc,
	updateDoc,
	deleteDoc,
	query,
	orderBy,
	limit,
	startAfter,
	where,
} from 'firebase/firestore';
import { db } from './config';

const TASKS_COLLECTION = 'tasks';
const ITEMS_LIMIT = 50;

/**
 * Load tasks from Firestore with pagination
 * Matches Android: FirebaseRemoteDatabase.loadTasks()
 *
 * @param {string|null} lastTimestamp - Last task timestamp for pagination
 * @returns {Promise<{success: boolean, tasks?: Array, lastTimestamp?: string, canLoadMore?: boolean, error?: string}>}
 */
export const loadTasks = async (lastTimestamp = null) => {
	try {
		let q;

		if (lastTimestamp) {
			// Pagination: start after the last timestamp
			q = query(
				collection(db, TASKS_COLLECTION),
				orderBy('timestamp', 'desc'),
				startAfter(lastTimestamp),
				limit(ITEMS_LIMIT)
			);
		} else {
			// Initial load
			q = query(
				collection(db, TASKS_COLLECTION),
				orderBy('timestamp', 'desc'),
				limit(ITEMS_LIMIT)
			);
		}

		const snapshot = await getDocs(q);
		const tasks = snapshot.docs
			.map((doc) => mapDocumentToTask(doc))
			.filter((task) => task !== null);

		const newLastTimestamp = tasks.length > 0 ? tasks[tasks.length - 1].timestamp : null;

		return {
			success: true,
			tasks,
			lastTimestamp: newLastTimestamp,
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
 * Add a new task to Firestore
 * Matches Android: FirebaseRemoteDatabase.addTask()
 *
 * @param {string} description - Task description
 * @param {string} startTime - ISO 8601 start time
 * @param {string} endTime - ISO 8601 end time
 * @returns {Promise<{success: boolean, task?: Object, error?: string}>}
 */
export const addTask = async (description, startTime, endTime) => {
	try {
		// Generate ID in format YYYYMMDD_N (matching Android implementation)
		const taskId = await generateTaskId(startTime);

		// Use ISO format for timestamp to match existing data format
		const timestamp = new Date().toISOString();

		const task = {
			id: taskId,
			description,
			timestamp,
			startTime,
			endTime,
		};

		await setDoc(doc(db, TASKS_COLLECTION, taskId), task);

		return { success: true, task };
	} catch (error) {
		console.error('Error adding task:', error);
		return {
			success: false,
			error: getFirestoreErrorMessage(error),
		};
	}
};

/**
 * Update an existing task in Firestore
 * Matches Android: FirebaseRemoteDatabase.updateTask()
 *
 * @param {string} taskId - Task ID to update
 * @param {string} description - New description
 * @param {string} startTime - New start time
 * @param {string} endTime - New end time
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateTask = async (taskId, description, startTime, endTime) => {
	try {
		// Find the document with the matching taskId
		const q = query(collection(db, TASKS_COLLECTION), where('id', '==', taskId));
		const snapshot = await getDocs(q);

		if (snapshot.empty) {
			return { success: false, error: 'Task not found' };
		}

		// Update the first matching document
		const documentId = snapshot.docs[0].id;
		const updates = {
			description,
			startTime,
			endTime,
		};

		await updateDoc(doc(db, TASKS_COLLECTION, documentId), updates);

		return { success: true };
	} catch (error) {
		console.error('Error updating task:', error);
		return {
			success: false,
			error: getFirestoreErrorMessage(error),
		};
	}
};

/**
 * Delete a task from Firestore
 * (Additional feature not in Android RemoteDatabase interface but useful for React)
 *
 * @param {string} taskId - Task ID to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteTask = async (taskId) => {
	try {
		// Find the document with the matching taskId
		const q = query(collection(db, TASKS_COLLECTION), where('id', '==', taskId));
		const snapshot = await getDocs(q);

		if (snapshot.empty) {
			return { success: false, error: 'Task not found' };
		}

		// Delete the document
		const documentId = snapshot.docs[0].id;
		await deleteDoc(doc(db, TASKS_COLLECTION, documentId));

		return { success: true };
	} catch (error) {
		console.error('Error deleting task:', error);
		return {
			success: false,
			error: getFirestoreErrorMessage(error),
		};
	}
};

/**
 * Map Firestore document to Task object
 * Matches Android: TaskMapper.toTask()
 *
 * @param {DocumentSnapshot} doc - Firestore document
 * @returns {Object|null} Task object or null if mapping fails
 */
const mapDocumentToTask = (doc) => {
	try {
		const data = doc.data();
		const id = data.id;
		const description = data.description;
		const timestamp = data.timestamp;
		const startTime = data.startTime;
		const endTime = data.endTime;

		// Return null if any required field is missing (like Android's mapNotNull)
		if (!id || !description || !timestamp || !startTime || !endTime) {
			return null;
		}

		return { id, description, timestamp, startTime, endTime };
	} catch (error) {
		console.error('Error mapping document to task:', error);
		return null;
	}
};

/**
 * Generate task ID in format YYYYMMDD_N
 * Matches Android: FirebaseRemoteDatabase.generateTaskId()
 *
 * @param {string} startTime - ISO 8601 start time
 * @returns {Promise<string>} Generated task ID
 */
const generateTaskId = async (startTime) => {
	// Parse the startTime (ISO 8601 format: 2026-01-02T14:00:00-03:00)
	const date = new Date(startTime);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const datePrefix = `${year}${month}${day}`;

	// Query all tasks with IDs to find the highest number for today's date
	const q = query(collection(db, TASKS_COLLECTION), orderBy('id', 'desc'));
	const snapshot = await getDocs(q);

	// Find the highest number for today's date
	let maxNumber = 0;
	snapshot.docs.forEach((doc) => {
		const id = doc.data().id;
		if (id && id.startsWith(`${datePrefix}_`)) {
			const numberPart = parseInt(id.split('_')[1], 10) || 0;
			if (numberPart > maxNumber) {
				maxNumber = numberPart;
			}
		}
	});

	// Return the next ID
	return `${datePrefix}_${maxNumber + 1}`;
};

/**
 * Convert Firestore error to user-friendly message
 * Matches Android: DataError.Firebase error handling
 *
 * @param {Error} error - Firestore error
 * @returns {string} User-friendly error message
 */
const getFirestoreErrorMessage = (error) => {
	const errorCode = error.code;

	switch (errorCode) {
		case 'permission-denied':
			return 'You do not have permission to perform this action.';
		case 'unavailable':
			return 'Service is temporarily unavailable. Please try again.';
		case 'not-found':
			return 'The requested document was not found.';
		case 'already-exists':
			return 'A document with this ID already exists.';
		case 'resource-exhausted':
			return 'Quota exceeded. Please try again later.';
		case 'cancelled':
			return 'Operation was cancelled.';
		case 'data-loss':
			return 'Data loss occurred. Please contact support.';
		case 'unauthenticated':
			return 'You must be logged in to perform this action.';
		default:
			return error.message || 'An error occurred. Please try again.';
	}
};

/**
 * Extract unique descriptions from tasks for autocomplete suggestions
 * Matches Android: TaskScreenViewModel extracting descriptions
 *
 * @param {Array} tasks - Array of task objects
 * @param {number} limit - Maximum number of suggestions (default: 10)
 * @returns {Array<string>} Array of unique descriptions
 */
export const extractSuggestions = (tasks, suggestionsLimit = 10) => {
	const descriptions = [...new Set(tasks.map((task) => task.description))];
	return descriptions.slice(0, suggestionsLimit);
};

// Export constants
export { ITEMS_LIMIT };
