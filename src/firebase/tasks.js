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
const ITEMS_LIMIT = 20;

/**
 * Load tasks from Firestore with pagination
 */
export const loadTasks = async (lastTimestamp = null) => {
  try {
    let q = query(
      collection(db, TASKS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(ITEMS_LIMIT)
    );

    // If we have a lastTimestamp, start after it for pagination
    if (lastTimestamp) {
      q = query(
        collection(db, TASKS_COLLECTION),
        orderBy('timestamp', 'desc'),
        startAfter(lastTimestamp),
        limit(ITEMS_LIMIT)
      );
    }

    const snapshot = await getDocs(q);
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.data().id,
      description: doc.data().description,
      timestamp: doc.data().timestamp,
      startTime: doc.data().startTime,
      endTime: doc.data().endTime,
    }));

    return { success: true, tasks };
  } catch (error) {
    console.error('Error loading tasks:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Add a new task to Firestore
 */
export const addTask = async (description, startTime, endTime) => {
  try {
    // Generate ID in format YYYYMMDD_N (matching Android implementation)
    const taskId = await generateTaskId(startTime);

    // Use ISO format for timestamp
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
    return { success: false, error: error.message };
  }
};

/**
 * Update an existing task in Firestore
 */
export const updateTask = async (taskId, description, startTime, endTime) => {
  try {
    // Find the document with the matching taskId
    const q = query(
      collection(db, TASKS_COLLECTION),
      where('id', '==', taskId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, error: 'Task not found' };
    }

    // Update the document
    const documentId = snapshot.docs[0].id;
    await updateDoc(doc(db, TASKS_COLLECTION, documentId), {
      description,
      startTime,
      endTime,
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a task from Firestore
 */
export const deleteTask = async (taskId) => {
  try {
    // Find the document with the matching taskId
    const q = query(
      collection(db, TASKS_COLLECTION),
      where('id', '==', taskId)
    );
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
    return { success: false, error: error.message };
  }
};

/**
 * Generate task ID in format YYYYMMDD_N (matching Android implementation)
 */
const generateTaskId = async (startTime) => {
  // Parse the startTime (ISO 8601 format)
  const date = new Date(startTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const datePrefix = `${year}${month}${day}`;

  // Query all tasks to find the highest number for today's date
  const q = query(
    collection(db, TASKS_COLLECTION),
    orderBy('id', 'desc')
  );
  const snapshot = await getDocs(q);

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

  return `${datePrefix}_${maxNumber + 1}`;
};
