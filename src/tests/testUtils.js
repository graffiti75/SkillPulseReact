import { vi } from 'vitest';

// Mock task data
export const mockTask = {
	id: 'T2025-01-14-001',
	description: 'Complete project documentation',
	startTime: '2025-01-14T09:00',
	endTime: '2025-01-14T17:00',
	timestamp: '2025-01-14T08:00:00.000Z',
};

export const mockTasks = [
	{
		id: 'T2025-01-14-001',
		description: 'Complete project documentation',
		startTime: '2025-01-14T09:00',
		endTime: '2025-01-14T17:00',
		timestamp: '2025-01-14T08:00:00.000Z',
	},
	{
		id: 'T2025-01-14-002',
		description: 'Review pull requests',
		startTime: '2025-01-14T10:00',
		endTime: '2025-01-14T12:00',
		timestamp: '2025-01-14T09:00:00.000Z',
	},
	{
		id: 'T2025-01-14-003',
		description: 'Team meeting',
		startTime: '2025-01-14T14:00',
		endTime: '2025-01-14T15:00',
		timestamp: '2025-01-14T13:00:00.000Z',
	},
];

// Mock Firebase functions
export const mockFirebaseFunctions = {
	addTask: vi.fn(),
	updateTask: vi.fn(),
	deleteTask: vi.fn(),
	loadTasks: vi.fn(),
	extractSuggestions: vi.fn(),
};

// Reset all mocks
export const resetMocks = () => {
	Object.values(mockFirebaseFunctions).forEach((mock) => mock.mockReset());
};

// Setup successful responses
export const setupSuccessfulMocks = () => {
	mockFirebaseFunctions.addTask.mockResolvedValue({
		success: true,
		task: mockTask,
	});

	mockFirebaseFunctions.updateTask.mockResolvedValue({
		success: true,
	});

	mockFirebaseFunctions.deleteTask.mockResolvedValue({
		success: true,
	});

	mockFirebaseFunctions.loadTasks.mockResolvedValue({
		success: true,
		tasks: mockTasks,
		lastTimestamp: mockTasks[mockTasks.length - 1].timestamp,
		canLoadMore: false,
	});

	mockFirebaseFunctions.extractSuggestions.mockReturnValue([
		'Complete project documentation',
		'Review pull requests',
		'Team meeting',
	]);
};

// Setup failed responses
export const setupFailedMocks = () => {
	mockFirebaseFunctions.addTask.mockResolvedValue({
		success: false,
		error: 'Failed to add task',
	});

	mockFirebaseFunctions.updateTask.mockResolvedValue({
		success: false,
		error: 'Failed to update task',
	});

	mockFirebaseFunctions.deleteTask.mockResolvedValue({
		success: false,
		error: 'Failed to delete task',
	});
};

// Wait for async operations
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0));
