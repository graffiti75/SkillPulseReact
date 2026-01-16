import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
	cleanup();
});

// Mock Firebase
vi.mock('../firebase/config', () => ({
	db: {},
	auth: {},
}));
