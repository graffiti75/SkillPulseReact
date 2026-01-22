import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signUp } from '../../firebase/auth/authOperations';
import * as firebaseAuth from 'firebase/auth';
import * as authErrors from '../../firebase/auth/authErrors';

vi.mock('firebase/auth');
vi.mock('../../firebase/auth/authErrors');
vi.mock('../../firebase/config', () => ({ auth: {} }));

describe('signUp', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return error if validation fails', async () => {
		const result = await signUp('', 'short');
		expect(result.success).toBe(false);
		expect(result.error).toBe('Email cannot be empty');
	});

	it('should return user on successful signup', async () => {
		const mockUser = { uid: '456', email: 'newuser@example.com' };
		firebaseAuth.createUserWithEmailAndPassword.mockResolvedValue({
			user: mockUser,
		});

		const result = await signUp('newuser@example.com', 'validpassword123');

		expect(result.success).toBe(true);
		expect(result.user).toEqual(mockUser);
	});

	it('should return error message on Firebase error', async () => {
		const mockError = { code: 'auth/email-already-in-use' };
		firebaseAuth.createUserWithEmailAndPassword.mockRejectedValue(mockError);
		authErrors.getAuthErrorMessage.mockReturnValue('Email already in use');

		const result = await signUp('existing@example.com', 'validpassword123');

		expect(result.success).toBe(false);
		expect(result.error).toBe('Email already in use');
	});
});
