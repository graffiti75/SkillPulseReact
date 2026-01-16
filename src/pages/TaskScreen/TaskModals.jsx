import { TaskForm, DeleteConfirmation } from '../../components/tasks';
import { Alert } from '../../components/common';

export const TaskModals = ({ ui, handlers, allTasks }) => (
	<>
		<TaskForm
			isOpen={ui.showAddForm}
			onClose={ui.closeAddForm}
			onSave={handlers.handleAddTask}
			editTask={null}
			allTasks={allTasks}
		/>
		<TaskForm
			isOpen={!!ui.editTaskData}
			onClose={ui.closeEditForm}
			onSave={handlers.handleEditTask}
			editTask={ui.editTaskData}
			allTasks={allTasks}
		/>
		<DeleteConfirmation
			isOpen={ui.showDeleteDialog}
			onClose={ui.closeDeleteDialog}
			onConfirm={handlers.handleDeleteTask}
			taskDescription={ui.deleteTaskData?.description}
		/>
		{ui.alert && (
			<Alert message={ui.alert.message} type={ui.alert.type} onClose={ui.closeAlert} />
		)}
	</>
);
