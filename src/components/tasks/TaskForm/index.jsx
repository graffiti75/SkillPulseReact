import { Modal } from 'src/components/common';
import DateTimePicker from 'src/components/tasks/DateTimePicker/index';
import { useTaskFormState } from './useTaskFormState';
import { TaskFormFields } from './TaskFormFields';
import './TaskForm.css';

const TaskForm = ({ isOpen, onClose, onSave, editTask, allTasks = [] }) => {
	const state = useTaskFormState(editTask, isOpen);

	const handleSave = async () => {
		if (!state.description || !state.startTime || !state.endTime) return;
		state.setIsLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 500));
		onSave({
			description: state.description,
			startTime: state.startTime,
			endTime: state.endTime,
		});
		state.setIsLoading(false);
		onClose();
	};

	const isFormValid = state.description && state.startTime && state.endTime;

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} title={editTask ? 'Edit Task' : 'Add Task'}>
				<TaskFormFields state={state} allTasks={allTasks} editTask={editTask} />
				<button
					className="btn btn-primary btn-full"
					onClick={handleSave}
					disabled={state.isLoading || !isFormValid}
					style={{ marginTop: '8px' }}
				>
					{state.isLoading ? 'Saving...' : editTask ? 'Save Changes' : 'Add Task'}
				</button>
			</Modal>

			<DateTimePicker
				isOpen={state.showStartPicker}
				onClose={() => state.setShowStartPicker(false)}
				onSelect={state.setStartTime}
				title="Select Start Time"
			/>
			<DateTimePicker
				isOpen={state.showEndPicker}
				onClose={() => state.setShowEndPicker(false)}
				onSelect={state.setEndTime}
				title="Select End Time"
			/>
		</>
	);
};

export default TaskForm;
