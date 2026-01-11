import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './config';

/**
 * Sign in with email and password
 * Matches Android: FirebaseUserAuthentication.login()
 *
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export const login = async (email, password) => {
	// Validation (matches Android LoginScreenViewModel validation)
	if (!email || email.trim() === '') {
		return { success: false, error: 'Email cannot be empty' };
	}

	if (!password || password.trim() === '') {
		return { success: false, error: 'Password cannot be empty' };
	}

	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		return { success: true, user: userCredential.user };
	} catch (error) {
		console.error('Login error:', error);
		return { success: false, error: getAuthErrorMessage(error.code) };
	}
};

/**
 * Create a new user account
 * Matches Android: FirebaseUserAuthentication.signUp()
 *
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export const signUp = async (email, password) => {
	// Validation
	if (!email || email.trim() === '') {
		return { success: false, error: 'Email cannot be empty' };
	}

	if (!password || password.trim() === '') {
		return { success: false, error: 'Password cannot be empty' };
	}

	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		return { success: true, user: userCredential.user };
	} catch (error) {
		console.error('Sign up error:', error);
		return { success: false, error: getAuthErrorMessage(error.code) };
	}
};

/**
 * Sign out the current user
 * Matches Android: FirebaseUserAuthentication.logout()
 *
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const logout = async () => {
	try {
		await signOut(auth);
		return { success: true };
	} catch (error) {
		console.error('Logout error:', error);
		return { success: false, error: getAuthErrorMessage(error.code) };
	}
};

/**
 * Get the current logged in user
 * Matches Android: FirebaseUserAuthentication.userLogged()
 *
 * @returns {{success: boolean, user?: Object, email?: string, error?: string}}
 */
export const getCurrentUser = () => {
	try {
		const user = auth.currentUser;
		if (user) {
			return { success: true, user, email: user.email || '' };
		}
		return { success: true, user: null, email: '' };
	} catch (error) {
		console.error('Get current user error:', error);
		return { success: false, error: getAuthErrorMessage(error.code) };
	}
};

/**
 * Check if a user is logged in (async version)
 * Matches Android: FirebaseUserAuthentication.userLogged() but returns Promise
 *
 * @returns {Promise<{success: boolean, user?: Object, email?: string, error?: string}>}
 */
export const checkUserLogged = () => {
	return new Promise((resolve) => {
		const unsubscribe = onAuthStateChanged(
			auth,
			(user) => {
				unsubscribe();
				if (user) {
					resolve({ success: true, user, email: user.email || '' });
				} else {
					resolve({ success: true, user: null, email: '' });
				}
			},
			(error) => {
				unsubscribe();
				resolve({ success: false, error: getAuthErrorMessage(error.code) });
			}
		);
	});
};

/**
 * Subscribe to auth state changes
 * Used for reactive auth state management in React
 *
 * @param {Function} callback - Callback function receiving user object
 * @returns {Function} Unsubscribe function
 */
export const onAuthChange = (callback) => {
	return onAuthStateChanged(auth, callback);
};

/**
 * Convert Firebase auth error codes to user-friendly messages
 * Matches Android: DataError.Firebase error handling
 *
 * @param {string} errorCode - Firebase error code
 * @returns {string} User-friendly error message
 */
const getAuthErrorMessage = (errorCode) => {
	switch (errorCode) {
		// Sign up errors
		case 'auth/email-already-in-use':
			return 'This email is already registered. Please log in instead.';
		case 'auth/invalid-email':
			return 'Please enter a valid email address.';
		case 'auth/operation-not-allowed':
			return 'Email/password accounts are not enabled. Please contact support.';
		case 'auth/weak-password':
			return 'Password is too weak. Please use at least 6 characters.';

		// Login errors
		case 'auth/user-disabled':
			return 'This account has been disabled. Please contact support.';
		case 'auth/user-not-found':
			return 'No account found with this email. Please sign up first.';
		case 'auth/wrong-password':
			return 'Incorrect password. Please try again.';
		case 'auth/invalid-credential':
			return 'Invalid email or password. Please check your credentials.';

		// Rate limiting
		case 'auth/too-many-requests':
			return 'Too many failed attempts. Please try again later.';

		// Network errors
		case 'auth/network-request-failed':
			return 'Network error. Please check your internet connection.';

		// Google Play Services (Android-specific, but keeping for completeness)
		case 'auth/app-not-authorized':
			return 'App not authorized. Please contact support.';

		default:
			return 'An error occurred. Please try again.';
	}
};
