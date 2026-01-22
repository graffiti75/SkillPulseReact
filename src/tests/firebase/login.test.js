import { describe, it, expect, beforeEach, vi } from 'vitest';
import { login } from '../../firebase/auth/authOperations';
import * as firebaseAuth from 'firebase/auth';
import * as authValidation from '../../firebase/auth/authValidation';
import * as authErrors from '../../firebase/auth/authErrors';

vi.mock('firebase/auth');
vi.mock('../../firebase/auth/authValidation');
vi.mock('../../firebase/auth/authErrors');
vi.mock('../../firebase/config', () => ({ auth: {} }));

describe('login', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return error if validation fails', async () => {
		authValidation.validateCredentials.mockReturnValue({
			isValid: false,
			error: 'Invalid email format',
		});

		const result = await login('invalid', 'pass');

		expect(result.success).toBe(false);
		expect(result.error).toBe('Invalid email format');
	});

	it('should return user on successful login', async () => {
		const mockUser = { uid: '123', email: 'test@example.com' };
		authValidation.validateCredentials.mockReturnValue({ isValid: true });
		firebaseAuth.signInWithEmailAndPassword.mockResolvedValue({
			user: mockUser,
		});

		const result = await login('test@example.com', 'password123');

		expect(result.success).toBe(true);
		expect(result.user).toEqual(mockUser);
		expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
			{},
			'test@example.com',
			'password123'
		);
	});

	it('should return error message on Firebase error', async () => {
		authValidation.validateCredentials.mockReturnValue({ isValid: true });
		const mockError = { code: 'auth/user-not-found' };
		firebaseAuth.signInWithEmailAndPassword.mockRejectedValue(mockError);
		authErrors.getAuthErrorMessage.mockReturnValue('User not found');

		const result = await login('test@example.com', 'password123');

		expect(result.success).toBe(false);
		expect(result.error).toBe('User not found');
		expect(authErrors.getAuthErrorMessage).toHaveBeenCalledWith('auth/user-not-found');
	});
});
