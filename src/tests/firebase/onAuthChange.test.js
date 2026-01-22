import { describe, it, expect, vi } from 'vitest';
import { onAuthChange } from '../../firebase/auth/authOperations';
import * as firebaseAuth from 'firebase/auth';

vi.mock('firebase/auth');
vi.mock('../../firebase/config', () => ({ auth: {} }));

describe('onAuthChange', () => {
	it('should subscribe to auth state changes', () => {
		const mockCallback = vi.fn();
		const mockUnsubscribe = vi.fn();
		firebaseAuth.onAuthStateChanged.mockReturnValue(mockUnsubscribe);

		const unsubscribe = onAuthChange(mockCallback);

		expect(firebaseAuth.onAuthStateChanged).toHaveBeenCalledWith({}, mockCallback);
		expect(unsubscribe).toBe(mockUnsubscribe);
	});

	it('should call callback with user when auth state changes', () => {
		const mockCallback = vi.fn();
		firebaseAuth.onAuthStateChanged.mockImplementation((auth, cb) => {
			cb({ uid: '123', email: 'user@example.com' });
			return vi.fn();
		});

		onAuthChange(mockCallback);

		expect(mockCallback).toHaveBeenCalledWith({
			uid: '123',
			email: 'user@example.com',
		});
	});

	it('should return unsubscribe function', () => {
		const mockCallback = vi.fn();
		const mockUnsubscribe = vi.fn();
		firebaseAuth.onAuthStateChanged.mockReturnValue(mockUnsubscribe);

		const result = onAuthChange(mockCallback);

		expect(typeof result).toBe('function');
		result();
		expect(mockUnsubscribe).toHaveBeenCalled();
	});
});
