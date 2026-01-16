import { useState, useCallback } from 'react';
import { loadTasks, addTask, updateTask, deleteTask, extractSuggestions } from '../../firebase';

export const useTaskState = () => {
	const [tasks, setTasks] = useState([]);
	const [allTasks, setAllTasks] = useState([]);
	const [descriptions, setDescriptions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
	const [canLoadMore, setCanLoadMore] = useState(false);
	const [lastTimestamp, setLastTimestamp] = useState(null);
	const [filterDate, setFilterDate] = useState('');

	const fetchTasks = useCallback(async () => {
		setIsLoading(true);
		const result = await loadTasks(null);
		setIsLoading(false);
		if (result.success) {
			setAllTasks(result.tasks);
			setTasks(result.tasks);
			setLastTimestamp(result.lastTimestamp);
			setCanLoadMore(result.canLoadMore);
			setDescriptions(extractSuggestions(result.tasks));
		}
		return result;
	}, []);

	const loadMore = useCallback(async () => {
		if (showLoadingSpinner || !canLoadMore) return { success: false };
		setShowLoadingSpinner(true);
		const result = await loadTasks(lastTimestamp);
		if (result.success) {
			setAllTasks((p) => [...p, ...result.tasks]);
			setTasks((p) => [...p, ...result.tasks]);
			setLastTimestamp(result.lastTimestamp);
			setCanLoadMore(result.canLoadMore);
			setDescriptions((p) => [...new Set([...p, ...extractSuggestions(result.tasks)])]);
		}
		setShowLoadingSpinner(false);
		return result;
	}, [showLoadingSpinner, canLoadMore, lastTimestamp]);

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
