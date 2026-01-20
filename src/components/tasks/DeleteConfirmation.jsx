import { Icons } from '../common';
import './DeleteConfirmation.css';
import { Modal } from '../common';

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, taskDescription }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<div className="confirm-dialog">
				<div className="confirm-icon">
					<Icons.AlertCircle />
				</div>
				<h3 className="confirm-title">Delete Task?</h3>
				<p className="confirm-text">
					Are you sure you want to delete "{taskDescription}"? This action cannot be
					undone.
				</p>
				<div className="confirm-buttons">
					<button className="btn btn-secondary" onClick={onClose}>
						Cancel
					</button>
					<button className="btn btn-danger" onClick={onConfirm}>
						Delete
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default DeleteConfirmation;
