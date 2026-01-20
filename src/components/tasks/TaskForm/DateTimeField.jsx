import { Icons } from '../../common';
import { formatDateTime } from '../../../utils/dateUtils';

export const DateTimeField = ({ label, value, onClick, placeholder }) => {
	return (
		<div className="form-group">
			<label className="form-label">{label}</label>
			<div className="form-input-wrapper">
				<input
					type="text"
					className="form-input"
					placeholder={placeholder}
					value={value ? formatDateTime(value) : ''}
					readOnly
					onClick={onClick}
					style={{ cursor: 'pointer', paddingRight: '44px' }}
				/>
				<span className="form-input-icon" onClick={onClick}>
					<Icons.Calendar />
				</span>
			</div>
		</div>
	);
};
