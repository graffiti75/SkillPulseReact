import { useState, useEffect } from 'react';
import { Icons } from '../common';
import DateTimePicker from './DateTimePicker';
import { formatDateTime } from '../../utils/dateUtils';
import { extractSuggestions } from '../../firebase/tasks/taskSuggestions';
import './TaskForm.css';

const TaskForm = ({ isOpen, onClose, onSave, editTask, allTasks = [] }) => {
	const [description, setDescription] = useState('');
	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (editTask) {
			setDescription(editTask.description);
			setStartTime(editTask.startTime);
			setEndTime(editTask.endTime);
		} else {
			setDescription('');
			setStartTime('');
			setEndTime('');
		}
	}, [editTask, isOpen]);

	const filteredSuggestions = extractSuggestions(allTasks, description, 5).filter(
		(s) => s.toLowerCase() !== description.toLowerCase()
	);

	const handleSave = async () => {
		if (!description || !startTime || !endTime) return;
		setIsLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 500));
		onSave({ description, startTime, endTime });
		setIsLoading(false);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<>
			<div className="modal-overlay" onClick={onClose}>
				<div className="modal" onClick={(e) => e.stopPropagation()}>
					<div className="modal-header">
						<button className="modal-back" onClick={onClose}>
							<Icons.ArrowLeft />
						</button>
						<h2 className="modal-title">{editTask ? 'Edit Task' : 'Add Task'}</h2>
					</div>
					<div className="modal-body">
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

						<div className="form-group">
							<label className="form-label">Description</label>
							<textarea
								className="form-input form-textarea"
								placeholder="Enter task description"
								value={description}
								onChange={(e) => {
									setDescription(e.target.value);
									setShowSuggestions(e.target.value.length > 0);
								}}
								onFocus={() => setShowSuggestions(description.length > 0)}
								onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
							/>
							{showSuggestions && filteredSuggestions.length > 0 && (
								<div className="suggestions-list">
									{filteredSuggestions.map((suggestion, index) => (
										<div
											key={index}
											className="suggestion-item"
											onClick={() => {
												setDescription(suggestion);
												setShowSuggestions(false);
											}}
										>
											{suggestion}
										</div>
									))}
								</div>
							)}
						</div>

						<div className="form-group">
							<label className="form-label">Start Time</label>
							<div className="form-input-wrapper">
								<input
									type="text"
									className="form-input"
									placeholder="Select start date and time"
									value={startTime ? formatDateTime(startTime) : ''}
									readOnly
									onClick={() => setShowStartPicker(true)}
									style={{ cursor: 'pointer', paddingRight: '44px' }}
								/>
								<span
									className="form-input-icon"
									onClick={() => setShowStartPicker(true)}
								>
									<Icons.Calendar />
								</span>
							</div>
						</div>

						<div className="form-group">
							<label className="form-label">End Time</label>
							<div className="form-input-wrapper">
								<input
									type="text"
									className="form-input"
									placeholder="Select end date and time"
									value={endTime ? formatDateTime(endTime) : ''}
									readOnly
									onClick={() => setShowEndPicker(true)}
									style={{ cursor: 'pointer', paddingRight: '44px' }}
								/>
								<span
									className="form-input-icon"
									onClick={() => setShowEndPicker(true)}
								>
									<Icons.Calendar />
								</span>
							</div>
						</div>

						<button
							className="btn btn-primary btn-full"
							onClick={handleSave}
							disabled={isLoading || !description || !startTime || !endTime}
							style={{ marginTop: '8px' }}
						>
							{isLoading ? 'Saving...' : editTask ? 'Save Changes' : 'Add Task'}
						</button>
					</div>
				</div>
			</div>

			<DateTimePicker
				isOpen={showStartPicker}
				onClose={() => setShowStartPicker(false)}
				onSelect={setStartTime}
				title="Select Start Time"
			/>

			<DateTimePicker
				isOpen={showEndPicker}
				onClose={() => setShowEndPicker(false)}
				onSelect={setEndTime}
				title="Select End Time"
			/>
		</>
	);
};

export default TaskForm;
