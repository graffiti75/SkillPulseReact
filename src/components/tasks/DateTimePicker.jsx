import React, { useState } from 'react';
import { Icons } from '../common';
import './DateTimePicker.css';

const DateTimePicker = ({ isOpen, onClose, onSelect, title }) => {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [hours, setHours] = useState('12');
	const [minutes, setMinutes] = useState('00');
	const [step, setStep] = useState('date');

	const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const monthNames = [
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

	const getDaysInMonth = (date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDay = firstDay.getDay();

		const days = [];
		for (let i = 0; i < startingDay; i++) {
			days.push({ day: '', empty: true });
		}
		for (let i = 1; i <= daysInMonth; i++) {
			days.push({
				day: i,
				date: new Date(year, month, i),
				isToday: new Date().toDateString() === new Date(year, month, i).toDateString(),
				isSelected:
					selectedDate?.toDateString() === new Date(year, month, i).toDateString(),
			});
		}
		return days;
	};

	const handleDateSelect = (date) => {
		setSelectedDate(date);
	};

	const handleConfirm = () => {
		if (step === 'date') {
			setStep('time');
		} else {
			const dateTime = new Date(selectedDate);
			dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
			onSelect(dateTime.toISOString());
			onClose();
			setStep('date');
		}
	};

	if (!isOpen) return null;

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<button
						className="modal-back"
						onClick={() => (step === 'time' ? setStep('date') : onClose())}
					>
						<Icons.ArrowLeft />
					</button>
					<h2 className="modal-title">{title || 'Select Date & Time'}</h2>
				</div>
				<div className="datetime-picker">
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

					{step === 'date' && (
						<div className="calendar">
							<div className="calendar-header">
								<span className="calendar-month">
									{monthNames[currentMonth.getMonth()]}{' '}
									{currentMonth.getFullYear()}
								</span>
								<div className="calendar-nav">
									<button
										className="calendar-nav-btn"
										onClick={() =>
											setCurrentMonth(
												new Date(
													currentMonth.getFullYear(),
													currentMonth.getMonth() - 1
												)
											)
										}
									>
										<Icons.ChevronLeft />
									</button>
									<button
										className="calendar-nav-btn"
										onClick={() =>
											setCurrentMonth(
												new Date(
													currentMonth.getFullYear(),
													currentMonth.getMonth() + 1
												)
											)
										}
									>
										<Icons.ChevronRight />
									</button>
								</div>
							</div>
							<div className="calendar-grid">
								{daysOfWeek.map((day) => (
									<div key={day} className="calendar-day-header">
										{day}
									</div>
								))}
								{getDaysInMonth(currentMonth).map((item, index) => (
									<div
										key={index}
										className={`calendar-day ${item.empty ? 'empty' : ''} ${
											item.isToday ? 'today' : ''
										} ${item.isSelected ? 'selected' : ''}`}
										onClick={() => !item.empty && handleDateSelect(item.date)}
									>
										{item.day}
									</div>
								))}
							</div>
						</div>
					)}

					{step === 'time' && (
						<div className="time-picker">
							<input
								type="text"
								className="time-input"
								value={hours}
								onChange={(e) => {
									const val = e.target.value.replace(/\D/g, '').slice(0, 2);
									if (parseInt(val, 10) <= 23 || val === '') setHours(val);
								}}
								placeholder="HH"
							/>
							<span className="time-separator">:</span>
							<input
								type="text"
								className="time-input"
								value={minutes}
								onChange={(e) => {
									const val = e.target.value.replace(/\D/g, '').slice(0, 2);
									if (parseInt(val, 10) <= 59 || val === '') setMinutes(val);
								}}
								placeholder="MM"
							/>
						</div>
					)}

					<button className="btn btn-primary btn-full" onClick={handleConfirm}>
						{step === 'date' ? 'Next' : 'Confirm'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default DateTimePicker;
