import { DAYS_OF_WEEK } from './dateTimeConstants';
import { getDaysInMonth } from './dateTimeUtils';
import './DateTimePicker.css';

export const CalendarGrid = ({ selectedDate, currentMonth, onDateSelect }) => (
	<div className="calendar-grid">
		{DAYS_OF_WEEK.map((day) => (
			<div key={day} className="calendar-day-header">
				{day}
			</div>
		))}
		{getDaysInMonth(currentMonth).map((item, i) => {
			const isSelected = selectedDate?.toDateString() === item.date?.toDateString();
			return (
				<div
					key={i}
					className={`calendar-day ${item.empty ? 'empty' : ''} ${
						item.isToday ? 'today' : ''
					} ${isSelected ? 'selected' : ''}`}
					onClick={() => !item.empty && onDateSelect(item.date)}
				>
					{item.day}
				</div>
			);
		})}
	</div>
);
