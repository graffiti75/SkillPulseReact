import { useState } from 'react';
import { Modal, Alert } from 'src/components/common';
import { Icons } from 'src/components/common/Icons';
import { useAuth } from 'src/contexts/AuthContext';
import { downloadTasksByMonth } from 'src/firebase/tasks';
import { MonthYearPicker } from './MonthYearPicker';
import { FormatSelector } from './FormatSelector';
import './DownloadScreen.css';

const DownloadScreen = ({ isOpen, onClose }) => {
	const { user } = useAuth();
	const currentDate = new Date();
	const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
	const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
	const [format, setFormat] = useState('json');
	const [formattedDates, setFormattedDates] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [alert, setAlert] = useState(null);

	const showAlert = (message, type = 'success') => {
		setAlert({ message, type });
	};

	const handleDownload = async () => {
		console.log('DOWNLOAD:', {
			year: selectedYear,
			month: selectedMonth,
			userEmail: user.email,
		});

		// Guard: Don't download if user is not logged in
		if (!user?.email) {
			showAlert('User not authenticated', 'error');
			return;
		}

		setIsLoading(true);

		const result = await downloadTasksByMonth(
			user.email,
			selectedYear,
			selectedMonth,
			format,
			formattedDates
		);

		if (result.success) {
			showAlert(`Downloaded ${result.taskCount} tasks as ${result.filename}`, 'success');
		} else {
			showAlert(result.error || 'Failed to download tasks', 'error');
		}

		setIsLoading(false);
	};

	const handleMonthChange = (year, month) => {
		setSelectedYear(year);
		setSelectedMonth(month);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Download Tasks" maxWidth="550px">
			<div className="download-screen">
				<div className="download-section">
					<h3 className="section-title">
						<Icons.Calendar />
						Select Month
					</h3>
					<MonthYearPicker
						year={selectedYear}
						month={selectedMonth}
						onChange={handleMonthChange}
					/>
				</div>

				<div className="download-section">
					<h3 className="section-title">
						<Icons.Filter />
						Export Format
					</h3>
					<FormatSelector
						format={format}
						onFormatChange={setFormat}
						formattedDates={formattedDates}
						onFormattedDatesChange={setFormattedDates}
					/>
				</div>

				<div className="download-actions">
					<button
						className="btn btn-primary btn-full"
						onClick={handleDownload}
						disabled={isLoading}
					>
						{isLoading ? <span className="btn-spinner" /> : <Icons.Download />}
						Download
					</button>
				</div>

				{alert && (
					<Alert
						message={alert.message}
						type={alert.type}
						onClose={() => setAlert(null)}
					/>
				)}
			</div>
		</Modal>
	);
};

export default DownloadScreen;
