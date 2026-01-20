import './DateTimePicker.css';

const DateTimePickerTabs = ({ step, selectedDate, setStep }) => {
	return (
		<div className="datetime-tabs">
			<button
				className={`datetime-tab ${step === 'date' ? 'active' : ''}`}
				onClick={() => setStep('date')}
			>
				📅 Date
			</button>
			<button
				className={`datetime-tab ${step === 'time' ? 'active' : ''}`}
				onClick={() => step === 'date' && selectedDate && setStep('time')}
			>
				🕐 Time
			</button>
		</div>
	);
};

export default DateTimePickerTabs;
