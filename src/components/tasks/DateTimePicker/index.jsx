import './DateTimePicker.css';
import DateTimePickerHeader from './DateTimePickerHeader';
import DateTimePickerBody from './DateTimePickerBody';

const DateTimePicker = ({ isOpen, onClose, onSelect, title }) => {
	if (!isOpen) return null;

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal" onClick={(e) => e.stopPropagation()}>
				<DateTimePickerHeader isOpen={isOpen} onClose={onClose} title={title} />
				<DateTimePickerBody isOpen={isOpen} onClose={onClose} onSelect={onSelect} />
			</div>
		</div>
	);
};

// Exports
export default DateTimePicker;
export { default as Calendar } from './Calendar';
export { default as TimePicker } from './TimePicker';
export { useDateTimePicker } from './useDateTimePicker';
export { getDaysInMonth, createDateTime } from './dateTimeUtils';
export { DAYS_OF_WEEK, MONTH_NAMES } from './dateTimeConstants';
