export const FormatSelector = ({
	format,
	onFormatChange,
	formattedDates,
	onFormattedDatesChange,
}) => {
	return (
		<div className="format-selector">
			<div className="format-options">
				<label className={`format-option ${format === 'json' ? 'selected' : ''}`}>
					<input
						type="radio"
						name="format"
						value="json"
						checked={format === 'json'}
						onChange={(e) => onFormatChange(e.target.value)}
					/>
					<span className="format-icon">{'{ }'}</span>
					<span className="format-label">JSON</span>
					<span className="format-desc">Structured data format</span>
				</label>

				<label className={`format-option ${format === 'csv' ? 'selected' : ''}`}>
					<input
						type="radio"
						name="format"
						value="csv"
						checked={format === 'csv'}
						onChange={(e) => onFormatChange(e.target.value)}
					/>
					<span className="format-icon">📊</span>
					<span className="format-label">CSV</span>
					<span className="format-desc">Spreadsheet compatible</span>
				</label>
			</div>

			{format === 'csv' && (
				<label className="checkbox-option">
					<input
						type="checkbox"
						checked={formattedDates}
						onChange={(e) => onFormattedDatesChange(e.target.checked)}
					/>
					<span className="checkbox-label">Use readable date format</span>
					<span className="checkbox-hint">
						(e.g., "Jan 15, 2025" instead of ISO format)
					</span>
				</label>
			)}
		</div>
	);
};

export default FormatSelector;
