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
	const t = useTaskState();
	const ui = useUIState();
	const h = createTaskHandlers(t, ui);

	useEffect(() => {
		t.fetchTasks().then((r) => !r.success && ui.showAlert(r.error, 'error'));
	}, []);

	return (
		<div className="app-container">
			<TaskHeader
				user={user}
				taskCount={t.allTasks.length}
				filteredCount={t.tasks.length}
				showFilter={ui.showFilter}
				onToggleFilter={ui.toggleFilter}
				onLogout={onLogout}
				filterDate={t.filterDate}
				onFilterChange={t.filterByDate}
			/>
			<TaskList
				tasks={t.tasks}
				isLoading={t.isLoading}
				canLoadMore={t.canLoadMore}
				filterDate={t.filterDate}
				showLoadingSpinner={t.showLoadingSpinner}
				onEdit={ui.openEditForm}
				onDelete={ui.openDeleteDialog}
				onLoadMore={h.handleLoadMore}
			/>
			<FAB onClick={ui.openAddForm} />
			<TaskModals ui={ui} handlers={h} allTasks={t.allTasks} />
		</div>
	);
};

export default TaskScreen;
