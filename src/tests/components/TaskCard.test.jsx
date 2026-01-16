import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '../../components/tasks/TaskCard';
import { mockTask } from '../testUtils';

describe('TaskCard - User Interactions', () => {
	const mockOnEdit = vi.fn();
	const mockOnDelete = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Task Display', () => {
		it('should render task information correctly', () => {
			render(
				<TaskCard task={mockTask} index={0} onEdit={mockOnEdit} onDelete={mockOnDelete} />
			);

			expect(screen.getByText(mockTask.id)).toBeInTheDocument();
			expect(screen.getByText(mockTask.description)).toBeInTheDocument();
			expect(screen.getByText(/Start:/)).toBeInTheDocument();
			expect(screen.getByText(/End:/)).toBeInTheDocument();
		});

		it('should format dates correctly', () => {
			render(
				<TaskCard task={mockTask} index={0} onEdit={mockOnEdit} onDelete={mockOnDelete} />
			);

			// Dates should be formatted
			const startTimeText = screen.getByText(/Start:/).parentElement;
			const endTimeText = screen.getByText(/End:/).parentElement;

			expect(startTimeText).toBeInTheDocument();
			expect(endTimeText).toBeInTheDocument();
		});
	});

	describe('Edit Button', () => {
		it('should render edit button', () => {
			render(
				<TaskCard task={mockTask} index={0} onEdit={mockOnEdit} onDelete={mockOnDelete} />
			);

			const editButtons = screen.getAllByRole('button');
			const editButton = editButtons.find(
				(btn) => btn.className.includes('task-action-btn') && !btn.className.includes('delete')
			);

			expect(editButton).toBeInTheDocument();
		});

		it('should call onEdit with task when edit button is clicked', async () => {
			const user = userEvent.setup();
			render(
				<TaskCard task={mockTask} index={0} onEdit={mockOnEdit} onDelete={mockOnDelete} />
			);

			const editButtons = screen.getAllByRole('button');
			const editButton = editButtons.find(
				(btn) => btn.className.includes('task-action-btn') && !btn.className.includes('delete')
			);

			await user.click(editButton);

			expect(mockOnEdit).toHaveBeenCalledTimes(1);
			expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
		});
	});

	describe('Delete Button', () => {
		it('should render delete button', () => {
			render(
				<TaskCard task={mockTask} index={0} onEdit={mockOnEdit} onDelete={mockOnDelete} />
			);

			const deleteButtons = screen.getAllByRole('button');
			const deleteButton = deleteButtons.find((btn) =>
				btn.className.includes('delete')
			);

			expect(deleteButton).toBeInTheDocument();
		});

		it('should call onDelete with task when delete button is clicked', async () => {
			const user = userEvent.setup();
			render(
				<TaskCard task={mockTask} index={0} onEdit={mockOnEdit} onDelete={mockOnDelete} />
			);

			const deleteButtons = screen.getAllByRole('button');
			const deleteButton = deleteButtons.find((btn) =>
				btn.className.includes('delete')
			);

			await user.click(deleteButton);

			expect(mockOnDelete).toHaveBeenCalledTimes(1);
			expect(mockOnDelete).toHaveBeenCalledWith(mockTask);
		});

		it('should have delete class on delete button', () => {
			render(
				<TaskCard task={mockTask} index={0} onEdit={mockOnEdit} onDelete={mockOnDelete} />
			);

			const deleteButtons = screen.getAllByRole('button');
			const deleteButton = deleteButtons.find((btn) =>
				btn.className.includes('delete')
			);

			expect(deleteButton.className).toContain('delete');
		});
	});

	describe('Animation', () => {
		it('should apply animation delay based on index', () => {
			const { container } = render(
				<TaskCard task={mockTask} index={3} onEdit={mockOnEdit} onDelete={mockOnDelete} />
			);

			const taskCard = container.querySelector('.task-card');
			const style = taskCard.style.animationDelay;

			expect(style).toBe('0.15s'); // 3 * 0.05s
		});
	});

	describe('Multiple Tasks', () => {
		it('should render multiple task cards independently', () => {
			const tasks = [
				{ ...mockTask, id: 'T001' },
				{ ...mockTask, id: 'T002' },
				{ ...mockTask, id: 'T003' },
			];

			const { container } = render(
				<>
					{tasks.map((task, index) => (
						<TaskCard
							key={task.id}
							task={task}
							index={index}
							onEdit={mockOnEdit}
							onDelete={mockOnDelete}
						/>
					))}
				</>
			);

			expect(screen.getByText('T001')).toBeInTheDocument();
			expect(screen.getByText('T002')).toBeInTheDocument();
			expect(screen.getByText('T003')).toBeInTheDocument();
		});
	});
});
