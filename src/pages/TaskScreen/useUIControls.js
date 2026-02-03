import { useState, useCallback } from 'react';
import { loadTasks, addTask, updateTask, deleteTask, extractSuggestions } from 'src/firebase';
import { useAuth } from 'src/contexts/AuthContext';

export const useUIControls = () => {
	const { user } = useAuth(); // Get current user
	const [tasks, setTasks] = useState([]);
	const [allTasks, setAllTasks] = useState([]);
	const [descriptions, setDescriptions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
	const [canLoadMore, setCanLoadMore] = useState(false);
	const [lastId, setLastId] = useState(null);
	const [filterDate, setFilterDate] = useState('');

	const fetchTasks = useCallback(async () => {
		// Guard: Don't fetch if user is not logged in
		if (!user?.email) {
			console.warn('⚠️  User not authenticated');
			setIsLoading(false);
			return { success: false, error: 'User not authenticated' };
		}

		setIsLoading(true);
		const result = await loadTasks(user.email, null);
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
	}, [user?.email]); // Add user.email as dependency

	const loadMore = useCallback(async () => {
		// Guard: Don't fetch if user is not logged in
		if (!user?.email) {
			console.warn('⚠️  User not authenticated');
			return { success: false, error: 'User not authenticated' };
		}

		if (showLoadingSpinner || !canLoadMore) return { success: false };
		setShowLoadingSpinner(true);

		console.log('=== LOAD MORE TASKS ===');
		console.log('User Email:', user.email);
		console.log('Last timestamp:', lastId);
		console.log('Can load more:', canLoadMore);

		const userId = user.uid;
		const result = await loadTasks(user.email, lastId);
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
	}, [user?.email, showLoadingSpinner, canLoadMore, lastId]); // Add user.email as dependency

	const filterByDate = useCallback(
		(date) => {
			setFilterDate(date);
			setTasks(date ? allTasks.filter((t) => t.startTime.includes(date)) : allTasks);
		},
		[allTasks]
	);

	const addNewTask = useCallback(
		async (data) => {
			// Guard: Don't add if user is not logged in
			if (!user?.email) {
				console.warn('⚠️  User not authenticated');
				return { success: false, error: 'User not authenticated' };
			}

			// Pass user email to addTask
			const result = await addTask(
				user.email,
				data.description,
				data.startTime,
				data.endTime
			);
			if (result.success) {
				setAllTasks((p) => [result.task, ...p]);
				setTasks((p) => [result.task, ...p]);
				setDescriptions((p) => [...new Set([data.description, ...p])]);
			}
			return result;
		},
		[user?.email]
	); // Add user.email as dependency

	const editTask = useCallback(
		async (id, data) => {
			// Guard: Don't edit if user is not logged in
			if (!user?.email) {
				console.warn('⚠️  User not authenticated');
				return { success: false, error: 'User not authenticated' };
			}

			// Pass user email to updateTask
			const result = await updateTask(
				user.email,
				id,
				data.description,
				data.startTime,
				data.endTime
			);
			if (result.success) {
				const upd = { id, ...data };
				setAllTasks((p) => p.map((t) => (t.id === id ? { ...t, ...upd } : t)));
				setTasks((p) => p.map((t) => (t.id === id ? { ...t, ...upd } : t)));
			}
			return result;
		},
		[user?.email]
	); // Add user.email as dependency

	const removeTask = useCallback(
		async (id) => {
			// Guard: Don't delete if user is not logged in
			if (!user?.email) {
				console.warn('⚠️  User not authenticated');
				return { success: false, error: 'User not authenticated' };
			}

			// Pass user email to deleteTask
			const result = await deleteTask(user.email, id);
			if (result.success) {
				setAllTasks((p) => p.filter((t) => t.id !== id));
				setTasks((p) => p.filter((t) => t.id !== id));
			}
			return result;
		},
		[user?.email]
	); // Add user.email as dependency

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
