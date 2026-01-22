import { Header, FilterBar } from 'src/components/layout';

export const TaskHeader = ({
	user,
	taskCount,
	filteredCount,
	showFilter,
	onToggleFilter,
	onLogout,
	filterDate,
	onFilterChange,
}) => (
	<>
		<Header
			user={user?.email?.split('@')[0] || 'User'}
			taskCount={taskCount}
			filteredCount={filteredCount}
			showFilter={showFilter}
			onToggleFilter={onToggleFilter}
			onLogout={onLogout}
		/>
		{showFilter && (
			<FilterBar
				filterDate={filterDate}
				onFilterChange={onFilterChange}
				onClear={() => onFilterChange('')}
			/>
		)}
	</>
);
