import { useEffect } from 'react';
import { FAB } from '../../components/layout';
import { useUIControls } from './useUIControls';
import { useTaskManager } from './useTaskManager';
import { createTaskHandlers } from './taskHandlers';
import { TaskHeader } from './TaskHeader';
import { TaskList } from './TaskList';
import { TaskModals } from './TaskModals';
import './TaskScreen.css';

const TaskScreen = ({ user, onLogout }) => {
	const uiControls = useUIControls();
	const taskManager = useTaskManager();
	const handlers = createTaskHandlers(uiControls, taskManager);

	useEffect(() => {
		uiControls
			.fetchTasks()
			.then((result) => !result.success && taskManager.showAlert(result.error, 'error'));
	}, []);

	return (
		<div className="app-container">
			<TaskHeader
				user={user}
				taskCount={uiControls.allTasks.length}
				filteredCount={uiControls.tasks.length}
				showFilter={taskManager.showFilter}
				onToggleFilter={taskManager.toggleFilter}
				onLogout={onLogout}
				filterDate={uiControls.filterDate}
				onFilterChange={uiControls.filterByDate}
			/>
			<TaskList
				tasks={uiControls.tasks}
				isLoading={uiControls.isLoading}
				canLoadMore={uiControls.canLoadMore}
				filterDate={uiControls.filterDate}
				showLoadingSpinner={uiControls.showLoadingSpinner}
				onEdit={taskManager.openEditForm}
				onDelete={taskManager.openDeleteDialog}
				onLoadMore={handlers.handleLoadMore}
			/>
			<FAB onClick={taskManager.openAddForm} />
			<TaskModals ui={taskManager} handlers={handlers} allTasks={uiControls.allTasks} />
		</div>
	);
};

export default TaskScreen;
