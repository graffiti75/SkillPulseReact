import { useState, useCallback } from 'react';
import { loadTasks, addTask, updateTask, deleteTask, extractSuggestions } from 'src/firebase';

export const useUIControls = () => {
	const [tasks, setTasks] = useState([]);
	const [allTasks, setAllTasks] = useState([]);
	const [descriptions, setDescriptions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
	const [canLoadMore, setCanLoadMore] = useState(false);
	const [lastId, setLastId] = useState(null);
	const [filterDate, setFilterDate] = useState('');

	const fetchTasks = useCallback(async () => {
		setIsLoading(true);
		const result = await loadTasks(null);
		setIsLoading(false);
		if (result.success) {
			// START LOGGING
			console.log('=== FIREBASE TASKS ===');
			console.log('Total tasks:', result.tasks.length);
			result.tasks.forEach((task, index) => {
				console.log(`Task ${index + 1}:`, {
					id: task.id,
					description: task.description,
					startTime: task.startTime,
					endTime: task.endTime,
					createdAt: task.createdAt,
					userId: task.userId,
					fullTask: task,
				});
			});
			console.log('=== END TASKS ===');
			// END LOGGING

			setAllTasks(result.tasks);
			setTasks(result.tasks);
			setLastId(result.lastId);
			setCanLoadMore(result.canLoadMore);
			setDescriptions(extractSuggestions(result.tasks));
		}
		return result;
	}, []);

	const loadMore = useCallback(async () => {
		if (showLoadingSpinner || !canLoadMore) return { success: false };
		setShowLoadingSpinner(true);

		console.log('=== LOAD MORE TASKS ===');
		console.log('Last timestamp:', lastId);
		console.log('Can load more:', canLoadMore);

		const result = await loadTasks(lastId);
		if (result.success) {
			console.log('New tasks loaded:', result.tasks.length);
			result.tasks.forEach((task, index) => {
				console.log(`New Task ${index + 1}:`, {
					id: task.id,
					description: task.description,
					startTime: task.startTime,
					endTime: task.endTime,
					createdAt: task.createdAt,
					userId: task.userId,
				});
			});
			console.log('New lastTimestamp:', result.lastId);
			console.log('Can load more:', result.canLoadMore);

			setAllTasks((p) => [...p, ...result.tasks]);
			setTasks((p) => [...p, ...result.tasks]);
			setLastId(result.lastId);
			setCanLoadMore(result.canLoadMore);
			setDescriptions((p) => [...new Set([...p, ...extractSuggestions(result.tasks)])]);
		} else {
			console.log('Load more failed:', result.error);
		}
		console.log('=== END LOAD MORE ===');
		setShowLoadingSpinner(false);
		return result;
	}, [showLoadingSpinner, canLoadMore, lastId]);

	const filterByDate = useCallback(
		(date) => {
			setFilterDate(date);
			setTasks(date ? allTasks.filter((t) => t.startTime.includes(date)) : allTasks);
		},
		[allTasks]
	);

	const addNewTask = useCallback(async (data) => {
		const result = await addTask(data.description, data.startTime, data.endTime);
		if (result.success) {
			setAllTasks((p) => [result.task, ...p]);
			setTasks((p) => [result.task, ...p]);
			setDescriptions((p) => [...new Set([data.description, ...p])]);
		}
		return result;
	}, []);

	const editTask = useCallback(async (id, data) => {
		const result = await updateTask(id, data.description, data.startTime, data.endTime);
		if (result.success) {
			const upd = { id, ...data };
			setAllTasks((p) => p.map((t) => (t.id === id ? { ...t, ...upd } : t)));
			setTasks((p) => p.map((t) => (t.id === id ? { ...t, ...upd } : t)));
		}
		return result;
	}, []);

	const removeTask = useCallback(async (id) => {
		const result = await deleteTask(id);
		if (result.success) {
			setAllTasks((p) => p.filter((t) => t.id !== id));
			setTasks((p) => p.filter((t) => t.id !== id));
		}
		return result;
	}, []);

	return {
		tasks,
		allTasks,
		descriptions,
		isLoading,
		showLoadingSpinner,
		canLoadMore,
		filterDate,
		fetchTasks,
		loadMore,
		filterByDate,
		addNewTask,
		editTask,
		removeTask,
	};
};
