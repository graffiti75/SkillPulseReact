import { Icons } from 'src/components/common';
import { useDateTimePicker } from './useDateTimePicker';
import './DateTimePicker.css';

const DateTimePickerHeader = ({ isOpen, onClose, title }) => {
	if (!isOpen) return null;

	const { step, setStep } = useDateTimePicker();

	return (
		<div className="modal-header">
			<button
				className="modal-back"
				onClick={() => (step === 'time' ? setStep('date') : onClose())}
			>
				<Icons.ArrowLeft />
			</button>
			<h2 className="modal-title">{title || 'Select Date and Time'}</h2>
		</div>
	);
};

export default DateTimePickerHeader;
