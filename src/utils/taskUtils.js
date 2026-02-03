import { v4 as uuidv4 } from 'uuid';

export const createTask = (userId, description, startTime, endTime) => ({
	id: uuidv4(),
	userId,
	description,
	timestamp: new Date().toISOString(),
	startTime,
	endTime,
});

export const SAMPLE_SUGGESTIONS = [
	'Water the plants',
	'Review project documentation',
	'Team meeting preparation',
	'Update client presentation',
	'Code review for feature branch',
	'Write unit tests',
	'Database optimization',
	'API integration testing',
	'Deploy to staging environment',
	'Weekly report submission',
];

export const SAMPLE_TASKS = [
	createTask('Complete project documentation', '2025-01-10T09:00:00', '2025-01-10T12:00:00'),
	createTask('Team standup meeting', '2025-01-10T10:00:00', '2025-01-10T10:30:00'),
	createTask('Code review for PR #42', '2025-01-10T14:00:00', '2025-01-10T15:00:00'),
];
