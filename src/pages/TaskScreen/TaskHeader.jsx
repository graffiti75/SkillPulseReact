import { Header, FilterBar } from 'src/components/layout';
import './TaskHeader.css';

export const TaskHeader = ({
	user,
	taskCount,
	filteredCount,
	showFilter,
	onToggleFilter,
	onLogout,
	onDownload,
	filterDate,
	onFilterChange,
}) => (
	<div className={`task-header-sticky ${showFilter ? 'task-header-with-filter' : ''}`}>
		<Header
			user={user?.email?.split('@')[0] || 'User'}
			taskCount={taskCount}
			filteredCount={filteredCount}
			showFilter={showFilter}
			onToggleFilter={onToggleFilter}
			onLogout={onLogout}
			onDownload={onDownload}
		/>
		{showFilter && (
			<FilterBar
				filterDate={filterDate}
				onFilterChange={onFilterChange}
				onClear={() => onFilterChange('')}
				onToggleFilter={onToggleFilter}
			/>
		)}
	</div>
);
