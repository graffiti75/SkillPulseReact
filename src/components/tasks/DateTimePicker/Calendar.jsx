import './DateTimePicker.css';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';

const Calendar = ({ selectedDate, currentMonth, onDateSelect, onMonthChange }) => (
	<div className="calendar">
		<CalendarHeader currentMonth={currentMonth} onMonthChange={onMonthChange} />
		<CalendarGrid
			selectedDate={selectedDate}
			currentMonth={currentMonth}
			onDateSelect={onDateSelect}
		/>
	</div>
);

export default Calendar;
