import React, { useState, useEffect, useCallback } from 'react';
import { Header, FilterBar, FAB } from '../components/layout';
import { TaskCard, TaskForm, DeleteConfirmation, EmptyState } from '../components/tasks';
import { Loading, Alert } from '../components/common';
import {
	loadTasks,
	addTask,
	updateTask,
	deleteTask,
	extractSuggestions,
	ITEMS_LIMIT,
} from '../firebase/tasks';
import './TaskScreen.css';

/**
 * TaskScreen component
 * Matches Android: TaskScreenViewModel behavior
 */
const TaskScreen = ({ user, onLogout }) => {
	// State matching Android TaskScreenState
	const [tasks, setTasks] = useState([]);
	const [allTasks, setAllTasks] = useState([]); // For filtering (matches Android allTasks)
	const [descriptions, setDescriptions] = useState([]); // Autocomplete suggestions
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [canLoadMore, setCanLoadMore] = useState(false);
	const [lastTimestamp, setLastTimestamp] = useState(null);
	const [filterDate, setFilterDate] = useState('');
	const [showFilter, setShowFilter] = useState(false);
	const [showAddForm, setShowAddForm] = useState(false);
	const [editTaskData, setEditTaskData] = useState(null);
	const [deleteTaskData, setDeleteTaskData] = useState(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [alert, setAlert] = useState(null);

	/**
	 * Load tasks from Firebase
	 * Matches Android: TaskScreenViewModel.loadTasks()
	 */
	const fetchTasks = useCallback(async () => {
		setIsLoading(true);
		setLastTimestamp(null);

		const result = await loadTasks(null);

		if (result.success) {
			const loadedTasks = result.tasks;
			setAllTasks(loadedTasks);
			setTasks(loadedTasks);
			setLastTimestamp(result.lastTimestamp);
			setCanLoadMore(result.canLoadMore);

			// Extract unique descriptions for suggestions (matches Android)
			const suggestions = extractSuggestions(loadedTasks);
			setDescriptions(suggestions);
		} else {
			setAlert({ message: result.error || 'Failed to load tasks', type: 'error' });
		}

		setIsLoading(false);
	}, []);

	/**
	 * Load more tasks (pagination)
	 * Matches Android: TaskScreenViewModel.loadMoreTasks()
	 */
	const handleLoadMore = useCallback(async () => {
		if (isLoadingMore || !canLoadMore) return;

		setIsLoadingMore(true);

		const result = await loadTasks(lastTimestamp);

		if (result.success) {
			const newTasks = result.tasks;
			const updatedAllTasks = [...allTasks, ...newTasks];

			setAllTasks(updatedAllTasks);
			setTasks((prev) => [...prev, ...newTasks]);
			setLastTimestamp(result.lastTimestamp);
			setCanLoadMore(result.canLoadMore);

			// Add new descriptions to suggestions (matches Android)
			const newSuggestions = extractSuggestions(newTasks);
			setDescriptions((prev) => [...new Set([...prev, ...newSuggestions])]);
		} else {
			setAlert({ message: result.error || 'Failed to load more tasks', type: 'error' });
		}

		setIsLoadingMore(false);
	}, [isLoadingMore, canLoadMore, lastTimestamp, allTasks]);

	/**
	 * Filter tasks by date
	 * Matches Android: TaskScreenViewModel.filterTasksByDate()
	 */
	const handleFilterByDate = useCallback(
		(date) => {
			if (!date) return;

			const filteredTasks = allTasks.filter((task) => task.startTime.includes(date));

			setTasks(filteredTasks);
			setFilterDate(date);
			setCanLoadMore(false); // Disable pagination when filtering
		},
		[allTasks]
	);

	/**
	 * Clear filter
	 * Matches Android: TaskScreenViewModel.clearFilter()
	 */
	const handleClearFilter = useCallback(() => {
		setTasks(allTasks);
		setFilterDate('');
		setCanLoadMore(allTasks.length >= ITEMS_LIMIT);
	}, [allTasks]);

	/**
	 * Add new task
	 * Matches Android: AddScreenViewModel flow
	 */
	const handleAddTask = async (taskData) => {
		const result = await addTask(taskData.description, taskData.startTime, taskData.endTime);

		if (result.success) {
			// Add to beginning of list (newest first)
			const newTask = result.task;
			setAllTasks((prev) => [newTask, ...prev]);
			setTasks((prev) => [newTask, ...prev]);

			// Update suggestions with new description
			setDescriptions((prev) => [...new Set([taskData.description, ...prev])]);

			setAlert({ message: 'Task added successfully!', type: 'success' });
		} else {
			setAlert({ message: result.error || 'Failed to add task', type: 'error' });
		}
	};

	/**
	 * Update existing task
	 * Matches Android: EditScreenViewModel flow
	 */
	const handleEditTask = async (taskData) => {
		const result = await updateTask(
			editTaskData.id,
			taskData.description,
			taskData.startTime,
			taskData.endTime
		);

		if (result.success) {
			const updatedTask = { ...editTaskData, ...taskData };

			setAllTasks((prev) => prev.map((t) => (t.id === editTaskData.id ? updatedTask : t)));
			setTasks((prev) => prev.map((t) => (t.id === editTaskData.id ? updatedTask : t)));

			setEditTaskData(null);
			setAlert({ message: 'Task updated successfully!', type: 'success' });
		} else {
			setAlert({ message: result.error || 'Failed to update task', type: 'error' });
		}
	};

	/**
	 * Show delete confirmation dialog
	 * Matches Android: TaskScreenViewModel.showDeleteDialog()
	 */
	const handleShowDeleteDialog = (task) => {
		setDeleteTaskData(task);
		setShowDeleteDialog(true);
	};

	/**
	 * Delete task
	 * Matches Android: TaskScreenViewModel.deleteTask()
	 */
	const handleDeleteConfirm = async () => {
		const result = await deleteTask(deleteTaskData.id);

		if (result.success) {
			// Remove from both lists (matches Android)
			setAllTasks((prev) => prev.filter((t) => t.id !== deleteTaskData.id));
			setTasks((prev) => prev.filter((t) => t.id !== deleteTaskData.id));

			setDeleteTaskData(null);
			setShowDeleteDialog(false);
			setAlert({ message: 'Task deleted successfully!', type: 'success' });
		} else {
			setAlert({ message: result.error || 'Failed to delete task', type: 'error' });
		}
	};

	/**
	 * Navigate to edit screen
	 * Matches Android: TaskScreenViewModel.navigateToEditScreen()
	 */
	const handleEditClick = (task) => {
		setEditTaskData(task);
	};

	/**
	 * Navigate to add screen
	 * Matches Android: TaskScreenViewModel.navigateToAddScreen()
	 */
	const handleAddClick = () => {
		setShowAddForm(true);
	};

	/**
	 * Refresh tasks (on screen resume)
	 * Matches Android: TaskScreenViewModel.refreshTasks()
	 */
	const handleRefresh = useCallback(() => {
		fetchTasks();
	}, [fetchTasks]);

	/**
	 * Dismiss alert
	 * Matches Android: TaskScreenViewModel.dismissAlert()
	 */
	const handleDismissAlert = () => {
		setAlert(null);
	};

	// Initial load (matches Android init block)
	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	// Infinite scroll handler
	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + document.documentElement.scrollTop >=
					document.documentElement.offsetHeight - 100 &&
				canLoadMore &&
				!isLoadingMore &&
				!filterDate
			) {
				handleLoadMore();
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [canLoadMore, isLoadingMore, filterDate, handleLoadMore]);

	// Get display name from Firebase user
	const displayName = user?.email?.split('@')[0] || 'User';

	return (
		<div className="app-container">
			<Header
				user={displayName}
				taskCount={allTasks.length}
				filteredCount={tasks.length}
				showFilter={showFilter}
				onToggleFilter={() => setShowFilter(!showFilter)}
				onLogout={onLogout}
			/>

			{showFilter && (
				<FilterBar
					filterDate={filterDate}
					onFilterChange={handleFilterByDate}
					onClear={handleClearFilter}
				/>
			)}

			<div className="content">
				{isLoading ? (
					<Loading />
				) : tasks.length === 0 ? (
					<EmptyState />
				) : (
					<>
						<div className="task-list">
							{tasks.map((task, index) => (
								<TaskCard
									key={task.id}
									task={task}
									index={index}
									onEdit={handleEditClick}
									onDelete={handleShowDeleteDialog}
								/>
							))}
						</div>

						{/* Load more indicator */}
						{isLoadingMore && (
							<div className="load-more-indicator">
								<Loading />
							</div>
						)}

						{/* End of list indicator */}
						{!canLoadMore && tasks.length > 0 && !filterDate && (
							<div className="end-of-list">No more tasks to load</div>
						)}
					</>
				)}
			</div>

			<FAB onClick={handleAddClick} />

			{/* Add Task Modal */}
			<TaskForm
				isOpen={showAddForm}
				onClose={() => setShowAddForm(false)}
				onSave={handleAddTask}
				editTask={null}
				suggestions={descriptions}
			/>

			{/* Edit Task Modal */}
			<TaskForm
				isOpen={!!editTaskData}
				onClose={() => setEditTaskData(null)}
				onSave={handleEditTask}
				editTask={editTaskData}
				suggestions={descriptions}
			/>

			{/* Delete Confirmation Modal */}
			<DeleteConfirmation
				isOpen={showDeleteDialog}
				onClose={() => {
					setShowDeleteDialog(false);
					setDeleteTaskData(null);
				}}
				onConfirm={handleDeleteConfirm}
				taskDescription={deleteTaskData?.description}
			/>

			{/* Alert Toast */}
			{alert && (
				<Alert message={alert.message} type={alert.type} onClose={handleDismissAlert} />
			)}
		</div>
	);
};

export default TaskScreen;
