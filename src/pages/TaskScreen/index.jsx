import { useEffect } from 'react';
import { FAB } from '../../components/layout';
import { useTaskState } from './useTaskState';
import { useUIState } from './useUIState';
import { createTaskHandlers } from './taskHandlers';
import { TaskHeader } from './TaskHeader';
import { TaskList } from './TaskList';
import { TaskModals } from './TaskModals';
import './TaskScreen.css';

const TaskScreen = ({ user, onLogout }) => {
	const taskState = useTaskState();
	const uiState = useUIState();
	const handlers = createTaskHandlers(taskState, uiState);

	useEffect(() => {
		taskState
			.fetchTasks()
			.then((result) => !result.success && uiState.showAlert(result.error, 'error'));
	}, []);

	return (
		<div className="app-container">
			<TaskHeader
				user={user}
				taskCount={taskState.allTasks.length}
				filteredCount={taskState.tasks.length}
				showFilter={uiState.showFilter}
				onToggleFilter={uiState.toggleFilter}
				onLogout={onLogout}
				filterDate={taskState.filterDate}
				onFilterChange={taskState.filterByDate}
			/>
			<TaskList
				tasks={taskState.tasks}
				isLoading={taskState.isLoading}
				canLoadMore={taskState.canLoadMore}
				filterDate={taskState.filterDate}
				showLoadingSpinner={taskState.showLoadingSpinner}
				onEdit={uiState.openEditForm}
				onDelete={uiState.openDeleteDialog}
				onLoadMore={handlers.handleLoadMore}
			/>
			<FAB onClick={uiState.openAddForm} />
			<TaskModals ui={uiState} handlers={handlers} allTasks={taskState.allTasks} />
		</div>
	);
};

export default TaskScreen;
