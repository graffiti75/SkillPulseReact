import React from 'react';
import { Icons } from '../common';
import './FilterBar.css';

const FilterBar = ({ filterDate, onFilterChange, onClear, onToggleFilter }) => {
	return (
		<div className="filter-bar">
			<input
				type="date"
				className="filter-input"
				value={filterDate}
				onChange={(e) => onFilterChange(e.target.value)}
				placeholder="Filter by date"
			/>
			<button
				className="filter-btn filter-btn-clear"
				onClick={onClear}
				disabled={!filterDate}
				style={{ opacity: filterDate ? 1 : 0.5 }}
			>
				<Icons.X />
				Clear
			</button>
			<button
				className="filter-btn filter-btn-close"
				onClick={onToggleFilter}
				title="Close filter"
			>
				<Icons.X />
			</button>
		</div>
	);
};

export default FilterBar;
