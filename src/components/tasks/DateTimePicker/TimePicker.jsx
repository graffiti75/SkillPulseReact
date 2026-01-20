import './DateTimePicker.css';

const TimeInput = ({ value, onChange, max, placeholder }) => (
	<input
		type="text"
		className="time-input"
		value={value}
		onChange={(e) => {
			const val = e.target.value.replace(/\D/g, '').slice(0, 2);
			if (parseInt(val, 10) <= max || val === '') onChange(val);
		}}
		placeholder={placeholder}
	/>
);

const TimePicker = ({ hours, minutes, onHoursChange, onMinutesChange }) => (
	<div className="time-picker">
		<TimeInput value={hours} onChange={onHoursChange} max={23} placeholder="HH" />
		<span className="time-separator">:</span>
		<TimeInput value={minutes} onChange={onMinutesChange} max={59} placeholder="MM" />
	</div>
);

export default TimePicker;
