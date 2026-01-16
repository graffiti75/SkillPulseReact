import {
	collection,
	doc,
	getDocs,
	setDoc,
	updateDoc,
	deleteDoc,
	query,
	where,
} from 'firebase/firestore';
import { db } from '../config';
import { TASKS_COLLECTION } from './constants';
import { generateTaskId } from './taskIdGenerator';
import { getFirestoreErrorMessage } from './errorHandler';

const findTaskDoc = async (taskId) => {
	const snapshot = await getDocs(
		query(collection(db, TASKS_COLLECTION), where('id', '==', taskId))
	);
	return snapshot.empty ? null : snapshot.docs[0].id;
};

export const addTask = async (description, startTime, endTime) => {
	try {
		const taskId = await generateTaskId(startTime);
		const task = {
			id: taskId,
			description,
			timestamp: new Date().toISOString(),
			startTime,
			endTime,
		};
		await setDoc(doc(db, TASKS_COLLECTION, taskId), task);
		return { success: true, task };
	} catch (error) {
		console.error('Error adding task:', error);
		return { success: false, error: getFirestoreErrorMessage(error) };
	}
};

export const updateTask = async (taskId, description, startTime, endTime) => {
	try {
		const documentId = await findTaskDoc(taskId);
		if (!documentId) return { success: false, error: 'Task not found' };
		await updateDoc(doc(db, TASKS_COLLECTION, documentId), { description, startTime, endTime });
		return { success: true };
	} catch (error) {
		console.error('Error updating task:', error);
		return { success: false, error: getFirestoreErrorMessage(error) };
	}
};

export const deleteTask = async (taskId) => {
	try {
		const documentId = await findTaskDoc(taskId);
		if (!documentId) return { success: false, error: 'Task not found' };
		await deleteDoc(doc(db, TASKS_COLLECTION, documentId));
		return { success: true };
	} catch (error) {
		console.error('Error deleting task:', error);
		return { success: false, error: getFirestoreErrorMessage(error) };
	}
};
