import { describe, it, expect, beforeEach, vi } from 'vitest';
import { logout } from '../../firebase/auth/authOperations';
import * as firebaseAuth from 'firebase/auth';
import * as authErrors from '../../firebase/auth/authErrors';

vi.mock('firebase/auth');
vi.mock('../../firebase/auth/authErrors');
vi.mock('../../firebase/config', () => ({ auth: {} }));

describe('logout', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return success on successful logout', async () => {
		firebaseAuth.signOut.mockResolvedValue();

		const result = await logout();

		expect(result.success).toBe(true);
		expect(result.error).toBeUndefined();
		expect(firebaseAuth.signOut).toHaveBeenCalledWith({});
	});

	it('should return error message on Firebase error', async () => {
		const mockError = { code: 'auth/network-request-failed' };
		firebaseAuth.signOut.mockRejectedValue(mockError);
		authErrors.getAuthErrorMessage.mockReturnValue('Network error');

		const result = await logout();

		expect(result.success).toBe(false);
		expect(result.error).toBe('Network error');
		expect(authErrors.getAuthErrorMessage).toHaveBeenCalledWith('auth/network-request-failed');
	});
});
