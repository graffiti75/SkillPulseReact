import Calendar from './Calendar';
import TimePicker from './TimePicker';
import { useDateTimePicker } from './useDateTimePicker';
import './DateTimePicker.css';
import DateTimePickerTabs from './DateTimePickerTabs';

const DateTimePickerBody = ({ isOpen, onClose, onSelect }) => {
	if (!isOpen) return null;

	const {
		selectedDate,
		currentMonth,
		hours,
		minutes,
		step,
		setSelectedDate,
		setHours,
		setMinutes,
		setStep,
		changeMonth,
		handleConfirm,
	} = useDateTimePicker();

	return (
		<div className="datetime-picker">
			<DateTimePickerTabs step={step} selectedDate={selectedDate} setStep={setStep} />
			{step === 'date' && (
				<Calendar
					selectedDate={selectedDate}
					currentMonth={currentMonth}
					onDateSelect={setSelectedDate}
					onMonthChange={changeMonth}
				/>
			)}
			{step === 'time' && (
				<TimePicker
					hours={hours}
					minutes={minutes}
					onHoursChange={setHours}
					onMinutesChange={setMinutes}
				/>
			)}
			<button
				className="btn btn-primary btn-full"
				onClick={() => handleConfirm(onSelect, onClose)}
			>
				{step === 'date' ? 'Next' : 'Confirm'}
			</button>
		</div>
	);
};

export default DateTimePickerBody;
