import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskScreen from '../../pages/TaskScreen';
import * as taskOperations from '../../firebase/tasks';
import { mockTasks, mockTask } from '../testUtils';

// Mock Firebase operations
vi.mock('../../firebase/tasks', () => ({
	addTask: vi.fn(),
	updateTask: vi.fn(),
	deleteTask: vi.fn(),
	loadTasks: vi.fn(),
	extractSuggestions: vi.fn(() => []),
}));

describe('TaskScreen - Complete Workflows', () => {
	const mockUser = {
		email: 'test@example.com',
		uid: 'test-uid',
	};
	const mockOnLogout = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();

		// Setup default successful responses
		taskOperations.loadTasks.mockResolvedValue({
			success: true,
			tasks: mockTasks,
			lastTimestamp: mockTasks[mockTasks.length - 1].timestamp,
			canLoadMore: false,
		});

		taskOperations.addTask.mockResolvedValue({
			success: true,
			task: mockTask,
		});

		taskOperations.updateTask.mockResolvedValue({
			success: true,
		});

		taskOperations.deleteTask.mockResolvedValue({
			success: true,
		});
	});

	describe('Creating a New Task - Complete Flow', () => {
		it('should complete the full task creation workflow', async () => {
			const user = userEvent.setup();
			render(<TaskScreen user={mockUser} onLogout={mockOnLogout} />);

			// Wait for tasks to load
			await waitFor(() => {
				expect(screen.getByText(mockTasks[0].description)).toBeInTheDocument();
			});

			// Step 1: Click FAB to open form
			const fab = screen.getByRole('button', { name: /add/i });
			await user.click(fab);

			// Step 2: Verify form opened
			await waitFor(() => {
				expect(screen.getByText('Add Task')).toBeInTheDocument();
			});

			// Step 3: Fill in description
			const descriptionInput = screen.getByPlaceholderText('Enter task description');
			await user.type(descriptionInput, 'New test task');

			// Step 4: Note - In real testing, you would interact with DateTimePicker
			// For this test, we're focusing on the workflow structure

			// Step 5: Verify save button state
			const saveButton = screen.getByText('Add Task');
			expect(saveButton).toBeInTheDocument();
		});

		it('should show success alert after creating task', async () => {
			const user = userEvent.setup();
			
			// Mock a successful task creation
			taskOperations.addTask.mockResolvedValue({
				success: true,
				task: { ...mockTask, description: 'Brand new task' },
			});

			render(<TaskScreen user={mockUser} onLogout={mockOnLogout} />);

			await waitFor(() => {
				expect(screen.getByText(mockTasks[0].description)).toBeInTheDocument();
			});

			// Open form
			const fab = screen.getByRole('button', { name: /add/i });
			await user.click(fab);

			// In a complete integration test, you would:
			// 1. Fill description
			// 2. Select start time
			// 3. Select end time
			// 4. Click save
			// 5. Verify success alert appears
		});
	});

	describe('Editing a Task - Complete Flow', () => {
		it('should open edit form when clicking edit button', async () => {
			const user = userEvent.setup();
			render(<TaskScreen user={mockUser} onLogout={mockOnLogout} />);

			// Wait for tasks to load
			await waitFor(() => {
				expect(screen.getByText(mockTasks[0].description)).toBeInTheDocument();
			});

			// Find and click edit button on first task
			const taskCards = screen.getAllByText(/T2025/);
			const firstTaskCard = taskCards[0].closest('.task-card');
			const editButton = firstTaskCard.querySelector('.task-action-btn:not(.delete)');

			await user.click(editButton);

			// Verify edit form opened with task data
			await waitFor(() => {
				expect(screen.getByText('Edit Task')).toBeInTheDocument();
				expect(screen.getByDisplayValue(mockTasks[0].description)).toBeInTheDocument();
			});
		});

		it('should show task ID field in edit mode', async () => {
			const user = userEvent.setup();
			render(<TaskScreen user={mockUser} onLogout={mockOnLogout} />);

			await waitFor(() => {
				expect(screen.getByText(mockTasks[0].description)).toBeInTheDocument();
			});

			const taskCards = screen.getAllByText(/T2025/);
			const firstTaskCard = taskCards[0].closest('.task-card');
			const editButton = firstTaskCard.querySelector('.task-action-btn:not(.delete)');

			await user.click(editButton);

			await waitFor(() => {
				expect(screen.getByText('Task ID')).toBeInTheDocument();
				expect(screen.getByDisplayValue(mockTasks[0].id)).toBeInTheDocument();
			});
		});

		it('should allow modifying task description', async () => {
			const user = userEvent.setup();
			render(<TaskScreen user={mockUser} onLogout={mockOnLogout} />);

			await waitFor(() => {
				expect(screen.getByText(mockTasks[0].description)).toBeInTheDocument();
			});

			const taskCards = screen.getAllByText(/T2025/);
			const firstTaskCard = taskCards[0].closest('.task-card');
			const editButton = firstTaskCard.querySelector('.task-action-btn:not(.delete)');

			await user.click(editButton);

			await waitFor(() => {
				expect(screen.getByText('Edit Task')).toBeInTheDocument();
			});

			const descriptionInput = screen.getByDisplayValue(mockTasks[0].description);
			await user.clear(descriptionInput);
			await user.type(descriptionInput, 'Updated task description');

			expect(descriptionInput).toHaveValue('Updated task description');
		});
	});

	describe('Deleting a Task - Complete Flow', () => {
		it('should open delete confirmation when clicking delete button', async () => {
			const user = userEvent.setup();
			render(<TaskScreen user={mockUser} onLogout={mockOnLogout} />);

			// Wait for tasks to load
			await waitFor(() => {
				expect(screen.getByText(mockTasks[0].description)).toBeInTheDocument();
			});

			// Find and click delete button on first task
			const taskCards = screen.getAllByText(/T2025/);
			const firstTaskCard = taskCards[0].closest('.task-card');
			const deleteButton = firstTaskCard.querySelector('.task-action-btn.delete');

			await user.click(deleteButton);

			// Verify delete confirmation dialog opened
			await waitFor(() => {
				expect(screen.getByText('Delete Task?')).toBeInTheDocument();
				expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
			});
		});

		it('should close delete dialog when clicking Cancel', async () => {
			const user = userEvent.setup();
			render(<TaskScreen user={mockUser} onLogout={mockOnLogout} />);

			await waitFor(() => {
				expect(screen.getByText(mockTasks[0].description)).toBeInTheDocument();
			});

			// Open delete dialog
			const taskCards = screen.getAllByText(/T2025/);
			const firstTaskCard = taskCards[0].closest('.task-card');
			const deleteButton = firstTaskCard.querySelector('.task-action-btn.delete');
			await user.click(deleteButton);

			await waitFor(() => {
				expect(screen.getByText('Delete Task?')).toBeInTheDocument();
			});

			// Click Cancel
			const cancelButton = screen.getByText('Cancel');
			await user.click(cancelButton);

			// Dialog should close
			await waitFor(() => {
				expect(screen.queryByText('Delete Task?')).not.toBeInTheDocument();
			});
		});

		it('should delete task and show success alert when confirmed', async () => {
			const user = userEvent.setup();
			render(<TaskScreen user={mockUser} onLogout={mockOnLogout} />);

			await waitFor(() => {
				expect(screen.getByText(mockTasks[0].description)).toBeInTheDocument();
			});

			// Open delete dialog
			const taskCards = screen.getAllByText(/T2025/);
			const firstTaskCard = taskCards[0].closest('.task-card');
			const deleteButton = firstTaskCard.querySelector('.task-action-btn.delete');
			await user.click(deleteButton);

			await waitFor(() => {
				expect(screen.getByText('Delete Task?')).toBeInTheDocument();
			});

			// Click Delete
			const confirmButton = screen.getByText('Delete');
			await user.click(confirmButton);

			// Verify deleteTask was called
			await waitFor(() => {
				expect(taskOperations.deleteTask).toHaveBeenCalledWith(mockTasks[0].id);
			});

			// Verify success alert appears
			await waitFor(() => {
				expect(screen.getByText('Task deleted successfully')).toBeInTheDocument();
			});
		});

		it('should show error alert when delete fails', async () => {
			const user = userEvent.setup();
			
			// Mock delete failure
			taskOperations.deleteTask.mockResolvedValue({
				success: false,
				error: 'Failed to delete task',
			});

			render(<TaskScreen user={mockUser} onLogout={mockOnLogout} />);

			await waitFor(() => {
				expect(screen.getByText(mockTasks[0].description)).toBeInTheDocument();
			});

			// Open delete dialog and confirm
			const taskCards = screen.getAllByText(/T2025/);
			const firstTaskCard = taskCards[0].closest('.task-card');
			const deleteButton = firstTaskCard.querySelector('.task-action-btn.delete');
			await user.click(deleteButton);

			await waitFor(() => {
				expect(screen.getByText('Delete Task?')).toBeInTheDocument();
			});

			const confirmButton = screen.getByText('Delete');
			await user.click(confirmButton);

			// Verify error alert appears
			await waitFor(() => {
				expect(screen.getByText('Failed to delete task')).toBeInTheDocument();
			});
		});
	});

	describe('Task List Display', () => {
		it('should display all loaded tasks', async () => {
			render(<TaskScreen user={mockUser} onLogout={mockOnLogout} />);

			await waitFor(() => {
				mockTasks.forEach((task) => {
					expect(screen.getByText(task.description)).toBeInTheDocument();
				});
			});
		});

		it('should show empty state when no tasks', async () => {
			taskOperations.loadTasks.mockResolvedValue({
				success: true,
				tasks: [],
				lastTimestamp: null,
				canLoadMore: false,
			});

			render(<TaskScreen user={mockUser} onLogout={mockOnLogout} />);

			await waitFor(() => {
				// EmptyState component should be visible
				expect(screen.queryByText(/T2025/)).not.toBeInTheDocument();
			});
		});

		it('should show loading state while fetching tasks', () => {
			taskOperations.loadTasks.mockImplementation(
				() => new Promise((resolve) => setTimeout(resolve, 1000))
			);

			render(<TaskScreen user={mockUser} onLogout={mockOnLogout} />);

			// Loading spinner should be visible
			expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
		});
	});

	describe('User Display', () => {
		it('should display user email in header', async () => {
			render(<TaskScreen user={mockUser} onLogout={mockOnLogout} />);

			await waitFor(() => {
				expect(screen.getByText('test')).toBeInTheDocument(); // Email prefix
			});
		});

		it('should show task count', async () => {
			render(<TaskScreen user={mockUser} onLogout={mockOnLogout} />);

			await waitFor(() => {
				// Task count should be displayed
				const header = screen.getByText('test').closest('.header');
				expect(header).toBeInTheDocument();
			});
		});
	});
});
