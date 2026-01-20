import { Icons } from '../../common';
import { MONTH_NAMES } from './dateTimeConstants';
import './DateTimePicker.css';

export const CalendarHeader = ({ currentMonth, onMonthChange }) => (
	<div className="calendar-header">
		<span className="calendar-month">
			{MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
		</span>
		<div className="calendar-nav">
			<button className="calendar-nav-btn" onClick={() => onMonthChange(-1)}>
				<Icons.ChevronLeft />
			</button>
			<button className="calendar-nav-btn" onClick={() => onMonthChange(1)}>
				<Icons.ChevronRight />
			</button>
		</div>
	</div>
);
