import { extractSuggestions } from '../../../firebase/tasks/taskSuggestions';

export const DescriptionField = ({
	description,
	setDescription,
	showSuggestions,
	setShowSuggestions,
	allTasks,
}) => {
	const filteredSuggestions = extractSuggestions(allTasks, description, 5).filter(
		(s) => s.toLowerCase() !== description.toLowerCase()
	);

	return (
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
	);
};
