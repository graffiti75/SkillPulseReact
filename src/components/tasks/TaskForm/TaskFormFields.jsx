import { DescriptionField } from './DescriptionField';
import { DateTimeField } from './DateTimeField';

export const TaskFormFields = ({ state, allTasks, editTask }) => {
	return (
		<>
			{editTask && (
				<div className="form-group">
					<label className="form-label">Task ID</label>
					<input
						type="text"
						className="form-input"
						value={editTask.id}
						disabled
						style={{ opacity: 0.6 }}
					/>
				</div>
			)}
			<DescriptionField {...state} allTasks={allTasks} />
			<DateTimeField
				label="Start Time"
				value={state.startTime}
				onClick={() => state.setShowStartPicker(true)}
				placeholder="Select start date and time"
			/>
			<DateTimeField
				label="End Time"
				value={state.endTime}
				onClick={() => state.setShowEndPicker(true)}
				placeholder="Select end date and time"
			/>
		</>
	);
};
