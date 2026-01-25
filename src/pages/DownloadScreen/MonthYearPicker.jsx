import { Icons } from 'src/components/common/Icons';

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

export const MonthYearPicker = ({ year, month, onChange }) => {
	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

	const handlePrevMonth = () => {
		if (month === 1) {
			onChange(year - 1, 12);
		} else {
			onChange(year, month - 1);
		}
	};

	const handleNextMonth = () => {
		if (month === 12) {
			onChange(year + 1, 1);
		} else {
			onChange(year, month + 1);
		}
	};

	const handleYearChange = (e) => {
		onChange(parseInt(e.target.value, 10), month);
	};

	const handleMonthChange = (e) => {
		onChange(year, parseInt(e.target.value, 10));
	};

	return (
		<div className="month-year-picker">
			<div className="picker-nav">
				<button
					type="button"
					className="nav-btn"
					onClick={handlePrevMonth}
					aria-label="Previous month"
				>
					<Icons.ChevronLeft />
				</button>

				<div className="picker-selects">
					<select
						className="picker-select"
						value={month}
						onChange={handleMonthChange}
						aria-label="Select month"
					>
						{MONTHS.map((monthName, idx) => (
							<option key={monthName} value={idx + 1}>
								{monthName}
							</option>
						))}
					</select>

					<select
						className="picker-select"
						value={year}
						onChange={handleYearChange}
						aria-label="Select year"
					>
						{years.map((y) => (
							<option key={y} value={y}>
								{y}
							</option>
						))}
					</select>
				</div>

				<button
					type="button"
					className="nav-btn"
					onClick={handleNextMonth}
					aria-label="Next month"
				>
					<Icons.ChevronRight />
				</button>
			</div>

			<div className="selected-period">
				{MONTHS[month - 1]} {year}
			</div>
		</div>
	);
};

export default MonthYearPicker;
