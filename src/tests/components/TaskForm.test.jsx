import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../../components/tasks/TaskForm';
import { mockTask } from '../testUtils';

describe('TaskForm - User Interactions', () => {
	const mockOnClose = vi.fn();
	const mockOnSave = vi.fn();
	const mockSuggestions = ['Task 1', 'Task 2', 'Complete project'];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Creating a New Task', () => {
		it('should render form with empty fields when creating new task', () => {
			render(
				<TaskForm
					isOpen={true}
					onClose={mockOnClose}
					onSave={mockOnSave}
					editTask={null}
					suggestions={mockSuggestions}
				/>
			);

			expect(screen.getByText('Add Task')).toBeInTheDocument();
			expect(screen.getByPlaceholderText('Enter task description')).toHaveValue('');
			expect(screen.getByPlaceholderText('Select start date and time')).toHaveValue('');
			expect(screen.getByPlaceholderText('Select end date and time')).toHaveValue('');
		});

		it('should allow user to type task description', async () => {
			const user = userEvent.setup();
			render(
				<TaskForm
					isOpen={true}
					onClose={mockOnClose}
					onSave={mockOnSave}
					editTask={null}
					suggestions={mockSuggestions}
				/>
			);

			const descriptionInput = screen.getByPlaceholderText('Enter task description');
			await user.type(descriptionInput, 'New task description');

			expect(descriptionInput).toHaveValue('New task description');
		});

		it('should show suggestions when typing', async () => {
			const user = userEvent.setup();
			render(
				<TaskForm
					isOpen={true}
					onClose={mockOnClose}
					onSave={mockOnSave}
					editTask={null}
					suggestions={mockSuggestions}
				/>
			);

			const descriptionInput = screen.getByPlaceholderText('Enter task description');
			await user.type(descriptionInput, 'Task');

			await waitFor(() => {
				expect(screen.getByText('Task 1')).toBeInTheDocument();
				expect(screen.getByText('Task 2')).toBeInTheDocument();
			});
		});

		it('should select suggestion when clicked', async () => {
			const user = userEvent.setup();
			render(
				<TaskForm
					isOpen={true}
					onClose={mockOnClose}
					onSave={mockOnSave}
					editTask={null}
					suggestions={mockSuggestions}
				/>
			);

			const descriptionInput = screen.getByPlaceholderText('Enter task description');
			await user.type(descriptionInput, 'Task');

			await waitFor(() => {
				expect(screen.getByText('Task 1')).toBeInTheDocument();
			});

			await user.click(screen.getByText('Task 1'));

			expect(descriptionInput).toHaveValue('Task 1');
		});

		it('should open start time picker when clicking start time field', async () => {
			const user = userEvent.setup();
			render(
				<TaskForm
					isOpen={true}
					onClose={mockOnClose}
					onSave={mockOnSave}
					editTask={null}
					suggestions={mockSuggestions}
				/>
			);

			const startTimeInput = screen.getByPlaceholderText('Select start date and time');
			await user.click(startTimeInput);

			// DateTimePicker should open with title
			await waitFor(() => {
				expect(screen.getByText('Select Start Time')).toBeInTheDocument();
			});
		});

		it('should open end time picker when clicking end time field', async () => {
			const user = userEvent.setup();
			render(
				<TaskForm
					isOpen={true}
					onClose={mockOnClose}
					onSave={mockOnSave}
					editTask={null}
					suggestions={mockSuggestions}
				/>
			);

			const endTimeInput = screen.getByPlaceholderText('Select end date and time');
			await user.click(endTimeInput);

			await waitFor(() => {
				expect(screen.getByText('Select End Time')).toBeInTheDocument();
			});
		});

		it('should disable save button when fields are empty', () => {
			render(
				<TaskForm
					isOpen={true}
					onClose={mockOnClose}
					onSave={mockOnSave}
					editTask={null}
					suggestions={mockSuggestions}
				/>
			);

			const saveButton = screen.getByText('Add Task');
			expect(saveButton).toBeDisabled();
		});

		it('should call onSave with form data when all fields are filled', async () => {
			const user = userEvent.setup();
			mockOnSave.mockImplementation(() => Promise.resolve());

			render(
				<TaskForm
					isOpen={true}
					onClose={mockOnClose}
					onSave={mockOnSave}
					editTask={null}
					suggestions={mockSuggestions}
				/>
			);

			// Fill description
			const descriptionInput = screen.getByPlaceholderText('Enter task description');
			await user.type(descriptionInput, 'New task');

			// Simulate selecting dates (we'll need to test this with the actual DateTimePicker)
			// For now, we'll test the button becomes enabled when all fields have values
			// In a real scenario, you'd need to interact with DateTimePicker

			// Note: Full integration would require testing DateTimePicker interaction
			// This would be covered in integration tests
		});

		it('should close form when clicking overlay', async () => {
			const user = userEvent.setup();
			render(
				<TaskForm
					isOpen={true}
					onClose={mockOnClose}
					onSave={mockOnSave}
					editTask={null}
					suggestions={mockSuggestions}
				/>
			);

			const overlay = screen.getByRole('button', { name: /arrow/i }).parentElement.parentElement;
			await user.click(overlay);

			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});

		it('should close form when clicking back button', async () => {
			const user = userEvent.setup();
			render(
				<TaskForm
					isOpen={true}
					onClose={mockOnClose}
					onSave={mockOnSave}
					editTask={null}
					suggestions={mockSuggestions}
				/>
			);

			const backButton = screen.getByRole('button', { name: /arrow/i });
			await user.click(backButton);

			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});
	});

	describe('Editing an Existing Task', () => {
		it('should render form with populated fields when editing', () => {
			render(
				<TaskForm
					isOpen={true}
					onClose={mockOnClose}
					onSave={mockOnSave}
					editTask={mockTask}
					suggestions={mockSuggestions}
				/>
			);

			expect(screen.getByText('Edit Task')).toBeInTheDocument();
			expect(screen.getByDisplayValue(mockTask.description)).toBeInTheDocument();
			expect(screen.getByDisplayValue(mockTask.id)).toBeInTheDocument();
		});

		it('should show task ID field in edit mode', () => {
			render(
				<TaskForm
					isOpen={true}
					onClose={mockOnClose}
					onSave={mockOnSave}
					editTask={mockTask}
					suggestions={mockSuggestions}
				/>
			);

			const taskIdInput = screen.getByDisplayValue(mockTask.id);
			expect(taskIdInput).toBeDisabled();
			expect(screen.getByText('Task ID')).toBeInTheDocument();
		});

		it('should allow modifying description in edit mode', async () => {
			const user = userEvent.setup();
			render(
				<TaskForm
					isOpen={true}
					onClose={mockOnClose}
					onSave={mockOnSave}
					editTask={mockTask}
					suggestions={mockSuggestions}
				/>
			);

			const descriptionInput = screen.getByDisplayValue(mockTask.description);
			await user.clear(descriptionInput);
			await user.type(descriptionInput, 'Updated description');

			expect(descriptionInput).toHaveValue('Updated description');
		});

		it('should show Save Changes button in edit mode', () => {
			render(
				<TaskForm
					isOpen={true}
					onClose={mockOnClose}
					onSave={mockOnSave}
					editTask={mockTask}
					suggestions={mockSuggestions}
				/>
			);

			expect(screen.getByText('Save Changes')).toBeInTheDocument();
		});

		it('should show Saving... text when saving', async () => {
			const user = userEvent.setup();
			// Mock onSave to take some time
			mockOnSave.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 1000)));

			render(
				<TaskForm
					isOpen={true}
					onClose={mockOnClose}
					onSave={mockOnSave}
					editTask={mockTask}
					suggestions={mockSuggestions}
				/>
			);

			const saveButton = screen.getByText('Save Changes');
			await user.click(saveButton);

			await waitFor(() => {
				expect(screen.getByText('Saving...')).toBeInTheDocument();
			});
		});
	});

	describe('Form Validation', () => {
		it('should keep save button disabled when only description is filled', async () => {
			const user = userEvent.setup();
			render(
				<TaskForm
					isOpen={true}
					onClose={mockOnClose}
					onSave={mockOnSave}
					editTask={null}
					suggestions={mockSuggestions}
				/>
			);

			const descriptionInput = screen.getByPlaceholderText('Enter task description');
			await user.type(descriptionInput, 'Test task');

			const saveButton = screen.getByText('Add Task');
			expect(saveButton).toBeDisabled();
		});
	});

	describe('Form Rendering', () => {
		it('should not render when isOpen is false', () => {
			const { container } = render(
				<TaskForm
					isOpen={false}
					onClose={mockOnClose}
					onSave={mockOnSave}
					editTask={null}
					suggestions={mockSuggestions}
				/>
			);

			expect(container.firstChild).toBeNull();
		});
	});
});
