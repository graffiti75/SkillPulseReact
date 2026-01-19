import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../config';
import { TASKS_COLLECTION, ITEMS_LIMIT } from './constants';
import { mapDocumentToTask } from './taskMapper';
import { getFirestoreErrorMessage } from './errorHandler';

export const loadTasks = async (lastTimestamp = null) => {
	try {
		const q = query(
			collection(db, TASKS_COLLECTION),
			orderBy('timestamp', 'desc'),
			...(lastTimestamp ? [startAfter(lastTimestamp)] : []),
			limit(ITEMS_LIMIT)
		);

		const snapshot = await getDocs(q);
		const tasks = snapshot.docs.map(mapDocumentToTask).filter(Boolean);
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
