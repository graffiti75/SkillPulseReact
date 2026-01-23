import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../config';
import { TASKS_COLLECTION, ITEMS_LIMIT } from './constants';
import { mapDocumentToTask } from './taskMapper';
import { getFirestoreErrorMessage } from './errorHandler';

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
