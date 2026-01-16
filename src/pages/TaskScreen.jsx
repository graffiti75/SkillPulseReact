import { useState, useEffect, useCallback } from 'react';
import { Header, FilterBar, FAB } from '../components/layout';
import { TaskCard, TaskForm, DeleteConfirmation, EmptyState } from '../components/tasks';
import { Loading, Alert } from '../components/common';
import { loadTasks, addTask, updateTask, deleteTask, ITEMS_LIMIT } from '../firebase';
import './TaskScreen.css';

const TaskScreen = ({ user, onLogout }) => {
	const [tasks, setTasks] = useState([]);
	const [allTasks, setAllTasks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
	const [canLoadMore, setCanLoadMore] = useState(false);
	const [lastTimestamp, setLastTimestamp] = useState(null);
	const [filterDate, setFilterDate] = useState('');
	const [showFilter, setShowFilter] = useState(false);
	const [showAddForm, setShowAddForm] = useState(false);
	const [editTaskData, setEditTaskData] = useState(null);
	const [deleteTaskData, setDeleteTaskData] = useState(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [alert, setAlert] = useState(null);

	const fetchTasks = useCallback(async () => {
		setIsLoading(true);
		const result = await loadTasks(null);

		if (result.success) {
			setAllTasks(result.tasks);
			setTasks(result.tasks);
			setLastTimestamp(result.lastTimestamp);
			setCanLoadMore(result.canLoadMore);
		} else {
			setAlert({ message: result.error || 'Failed to load tasks', type: 'error' });
		}
		setIsLoading(false);
	}, []);

	const handleLoadMore = async () => {
		if (showLoadingSpinner || !canLoadMore) return;

		// 1. Show spinner IMMEDIATELY
		setShowLoadingSpinner(true);

		// 2. WAIT for spinner to be painted on screen BEFORE starting fetch
		await new Promise((resolve) => {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					resolve();
				});
			});
		});

		// 3. NOW start Firebase fetch - spinner is guaranteed visible
		const result = await loadTasks(lastTimestamp);

		if (result.success) {
			const newTasks = result.tasks;
			const combined = [...allTasks, ...newTasks];

			// ADD THIS: Wait 5 seconds before showing the new tasks
			await new Promise((resolve) => setTimeout(resolve, 500));

			// 4. Update all state with new tasks
			setAllTasks(combined);
			setTasks(combined);
			setLastTimestamp(result.lastTimestamp);
			setCanLoadMore(result.canLoadMore);

			// 5. Wait for new tasks to be painted, THEN hide spinner
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setShowLoadingSpinner(false);
				});
			});
		} else {
			setAlert({ message: result.error || 'Failed to load more', type: 'error' });
			setShowLoadingSpinner(false);
		}
	};

	const handleFilterByDate = useCallback(
		(date) => {
			if (!date) return;
			setTasks(allTasks.filter((task) => task.startTime.includes(date)));
			setFilterDate(date);
		},
		[allTasks]
	);

	const handleClearFilter = useCallback(() => {
		setTasks(allTasks);
		setFilterDate('');
	}, [allTasks]);

	const handleAddTask = async (taskData) => {
		const result = await addTask(taskData.description, taskData.startTime, taskData.endTime);
		if (result.success) {
			const newTask = result.task;
			setAllTasks((prev) => [newTask, ...prev]);
			setTasks((prev) => [newTask, ...prev]);
			setDescriptions((prev) => [...new Set([taskData.description, ...prev])]);
			setShowAddForm(false);
			setAlert({ message: 'Task added!', type: 'success' });
		} else {
			setAlert({ message: result.error, type: 'error' });
		}
	};

	const handleEditTask = async (taskData) => {
		const result = await updateTask(
			editTaskData.id,
			taskData.description,
			taskData.startTime,
			taskData.endTime
		);
		if (result.success) {
			const updated = { ...editTaskData, ...taskData };
			setAllTasks((prev) => prev.map((t) => (t.id === editTaskData.id ? updated : t)));
			setTasks((prev) => prev.map((t) => (t.id === editTaskData.id ? updated : t)));
			setEditTaskData(null);
			setAlert({ message: 'Task updated!', type: 'success' });
		} else {
			setAlert({ message: result.error, type: 'error' });
		}
	};

	const handleDeleteConfirm = async () => {
		const result = await deleteTask(deleteTaskData.id);
		if (result.success) {
			setAllTasks((prev) => prev.filter((t) => t.id !== deleteTaskData.id));
			setTasks((prev) => prev.filter((t) => t.id !== deleteTaskData.id));
			setDeleteTaskData(null);
			setShowDeleteDialog(false);
			setAlert({ message: 'Task deleted!', type: 'success' });
		} else {
			setAlert({ message: result.error, type: 'error' });
		}
	};

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

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
									onEdit={(t) => setEditTaskData(t)}
									onDelete={(t) => {
										setDeleteTaskData(t);
										setShowDeleteDialog(true);
									}}
								/>
							))}
						</div>

						{/* Load More Button - only show when NOT loading */}
						{canLoadMore && !filterDate && !showLoadingSpinner && (
							<div className="load-more-container">
								<button className="load-more-btn" onClick={handleLoadMore}>
									Load More
								</button>
							</div>
						)}

						{/* End of list - only show when no more data and NOT loading */}
						{!canLoadMore && tasks.length > 0 && !filterDate && !showLoadingSpinner && (
							<div className="end-of-list">No more tasks</div>
						)}
					</>
				)}

				{/* SPINNER - Completely separate, controlled ONLY by showLoadingSpinner */}
				{showLoadingSpinner && (
					<div className="load-more-spinner">
						<div className="spinner"></div>
					</div>
				)}
			</div>

			<FAB onClick={() => setShowAddForm(true)} />

			<TaskForm
				isOpen={showAddForm}
				onClose={() => setShowAddForm(false)}
				onSave={handleAddTask}
				editTask={null}
				allTasks={allTasks}
			/>

			<TaskForm
				isOpen={!!editTaskData}
				onClose={() => setEditTaskData(null)}
				onSave={handleEditTask}
				editTask={editTaskData}
				allTasks={allTasks}
			/>

			<DeleteConfirmation
				isOpen={showDeleteDialog}
				onClose={() => {
					setShowDeleteDialog(false);
					setDeleteTaskData(null);
				}}
				onConfirm={handleDeleteConfirm}
				taskDescription={deleteTaskData?.description}
			/>

			{alert && (
				<Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
			)}
		</div>
	);
};

export default TaskScreen;
