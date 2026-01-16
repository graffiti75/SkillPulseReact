import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteConfirmation from '../../components/tasks/DeleteConfirmation';

describe('DeleteConfirmation - User Interactions', () => {
	const mockOnClose = vi.fn();
	const mockOnConfirm = vi.fn();
	const taskDescription = 'Complete project documentation';

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Dialog Display', () => {
		it('should render when isOpen is true', () => {
			render(
				<DeleteConfirmation
					isOpen={true}
					onClose={mockOnClose}
					onConfirm={mockOnConfirm}
					taskDescription={taskDescription}
				/>
			);

			expect(screen.getByText('Delete Task?')).toBeInTheDocument();
			expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
			expect(screen.getByText(new RegExp(taskDescription))).toBeInTheDocument();
		});

		it('should not render when isOpen is false', () => {
			const { container } = render(
				<DeleteConfirmation
					isOpen={false}
					onClose={mockOnClose}
					onConfirm={mockOnConfirm}
					taskDescription={taskDescription}
				/>
			);

			expect(container.firstChild).toBeNull();
		});

		it('should show warning message', () => {
			render(
				<DeleteConfirmation
					isOpen={true}
					onClose={mockOnClose}
					onConfirm={mockOnConfirm}
					taskDescription={taskDescription}
				/>
			);

			expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument();
		});
	});

	describe('Cancel Button', () => {
		it('should render cancel button', () => {
			render(
				<DeleteConfirmation
					isOpen={true}
					onClose={mockOnClose}
					onConfirm={mockOnConfirm}
					taskDescription={taskDescription}
				/>
			);

			expect(screen.getByText('Cancel')).toBeInTheDocument();
		});

		it('should call onClose when cancel button is clicked', async () => {
			const user = userEvent.setup();
			render(
				<DeleteConfirmation
					isOpen={true}
					onClose={mockOnClose}
					onConfirm={mockOnConfirm}
					taskDescription={taskDescription}
				/>
			);

			const cancelButton = screen.getByText('Cancel');
			await user.click(cancelButton);

			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});

		it('should have secondary button styling', () => {
			render(
				<DeleteConfirmation
					isOpen={true}
					onClose={mockOnClose}
					onConfirm={mockOnConfirm}
					taskDescription={taskDescription}
				/>
			);

			const cancelButton = screen.getByText('Cancel');
			expect(cancelButton.className).toContain('btn-secondary');
		});
	});

	describe('Delete Button', () => {
		it('should render delete button', () => {
			render(
				<DeleteConfirmation
					isOpen={true}
					onClose={mockOnClose}
					onConfirm={mockOnConfirm}
					taskDescription={taskDescription}
				/>
			);

			expect(screen.getByText('Delete')).toBeInTheDocument();
		});

		it('should call onConfirm when delete button is clicked', async () => {
			const user = userEvent.setup();
			render(
				<DeleteConfirmation
					isOpen={true}
					onClose={mockOnClose}
					onConfirm={mockOnConfirm}
					taskDescription={taskDescription}
				/>
			);

			const deleteButton = screen.getByText('Delete');
			await user.click(deleteButton);

			expect(mockOnConfirm).toHaveBeenCalledTimes(1);
		});

		it('should have danger button styling', () => {
			render(
				<DeleteConfirmation
					isOpen={true}
					onClose={mockOnClose}
					onConfirm={mockOnConfirm}
					taskDescription={taskDescription}
				/>
			);

			const deleteButton = screen.getByText('Delete');
			expect(deleteButton.className).toContain('btn-danger');
		});
	});

	describe('Overlay Interaction', () => {
		it('should call onClose when clicking overlay', async () => {
			const user = userEvent.setup();
			render(
				<DeleteConfirmation
					isOpen={true}
					onClose={mockOnClose}
					onConfirm={mockOnConfirm}
					taskDescription={taskDescription}
				/>
			);

			const overlay =
				screen.getByText('Delete Task?').parentElement.parentElement.parentElement;
			await user.click(overlay);

			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});

		it('should not close when clicking modal content', async () => {
			const user = userEvent.setup();
			render(
				<DeleteConfirmation
					isOpen={true}
					onClose={mockOnClose}
					onConfirm={mockOnConfirm}
					taskDescription={taskDescription}
				/>
			);

			const modalContent = screen.getByText('Delete Task?').parentElement;
			await user.click(modalContent);

			expect(mockOnClose).not.toHaveBeenCalled();
		});
	});

	describe('Task Description Display', () => {
		it('should display task description in quotes', () => {
			render(
				<DeleteConfirmation
					isOpen={true}
					onClose={mockOnClose}
					onConfirm={mockOnConfirm}
					taskDescription={taskDescription}
				/>
			);

			const message = screen.getByText((content, element) => {
				return element.textContent.includes(`"${taskDescription}"`);
			});

			expect(message).toBeInTheDocument();
		});

		it('should handle empty task description', () => {
			render(
				<DeleteConfirmation
					isOpen={true}
					onClose={mockOnClose}
					onConfirm={mockOnConfirm}
					taskDescription=""
				/>
			);

			expect(screen.getByText('Delete Task?')).toBeInTheDocument();
		});
	});
});
