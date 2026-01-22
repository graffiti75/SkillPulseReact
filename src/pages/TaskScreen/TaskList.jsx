import { TaskCard, EmptyState } from 'src/components/tasks';
import { Loading } from 'src/components/common';

export const TaskList = ({
	tasks,
	isLoading,
	canLoadMore,
	filterDate,
	showLoadingSpinner,
	onEdit,
	onDelete,
	onLoadMore,
}) => (
	<div className="content">
		{isLoading ? (
			<Loading />
		) : tasks.length === 0 ? (
			<EmptyState />
		) : (
			<>
				<div className="task-list">
					{tasks.map((task, i) => (
						<TaskCard
							key={task.id}
							task={task}
							index={i}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					))}
				</div>
				{canLoadMore && !filterDate && !showLoadingSpinner && (
					<div className="load-more-container">
						<button className="load-more-btn" onClick={onLoadMore}>
							Load More
						</button>
					</div>
				)}
				{!canLoadMore && tasks.length > 0 && !filterDate && !showLoadingSpinner && (
					<div className="end-of-list">No more tasks</div>
				)}
			</>
		)}
		{showLoadingSpinner && (
			<div className="load-more-spinner">
				<div className="spinner"></div>
			</div>
		)}
	</div>
);
