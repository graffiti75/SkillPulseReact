import { Icons } from '../common';
import { formatDateTime } from '../../utils/dateUtils';
import './TaskCard.css';

const TaskCard = ({ task, index, onEdit, onDelete }) => (
	<div className="task-card" style={{ animationDelay: `${index * 0.05}s` }}>
		<div className="task-header">
			<span className="task-id">{task.id}</span>
			<div className="task-actions">
				<button className="task-action-btn" onClick={() => onEdit(task)}>
					<Icons.Edit />
				</button>
				<button className="task-action-btn delete" onClick={() => onDelete(task)}>
					<Icons.Trash />
				</button>
			</div>
		</div>
		<div className="task-description">{task.description}</div>
		<div className="task-times">
			<div className="task-time">
				<Icons.Clock />
				<span className="task-time-label">Start:</span>
				<span>{formatDateTime(task.startTime)}</span>
			</div>
			<div className="task-time">
				<Icons.Clock />
				<span className="task-time-label">End:</span>
				<span>{formatDateTime(task.endTime)}</span>
			</div>
		</div>
	</div>
);

export default TaskCard;
