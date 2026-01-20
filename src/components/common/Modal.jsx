import { Icons } from './Icons';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, maxWidth = '500px' }) => {
	if (!isOpen) return null;

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth }}>
				{title && (
					<div className="modal-header">
						<button className="modal-back" onClick={onClose}>
							<Icons.ArrowLeft />
						</button>
						<h2 className="modal-title">{title}</h2>
					</div>
				)}
				<div className="modal-body">{children}</div>
			</div>
		</div>
	);
};

export default Modal;
