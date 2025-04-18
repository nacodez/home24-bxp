import {
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
    Auth
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth, isFirebaseAvailable } from '../firebase/config';
import { User, LoginCredentials } from '../types/user.types';

export const login = async (credentials: LoginCredentials): Promise<{ user: User, token: string }> => {
    try {
        // Special case for demo user - always works regardless of Firebase configuration
        if (credentials.email === 'demo@home24.de' && credentials.password === 'password') {
            const demoUser: User = {
                id: 'demo-user-id',
                email: 'demo@home24.de',
                name: 'Demo User'
            };
            return { user: demoUser, token: 'demo-token-123456' };
        }

        if (isFirebaseAvailable && auth) {
            // Regular Firebase authentication for other users
            const firebaseAuth = auth as Auth; // Cast to Auth type to satisfy TypeScript
            const userCredential: UserCredential = await signInWithEmailAndPassword(
                firebaseAuth,
                credentials.email,
                credentials.password
            );

            const token = await userCredential.user.getIdToken();

            const user: User = {
                id: userCredential.user.uid,
                email: userCredential.user.email || '',
                name: userCredential.user.displayName || credentials.email.split('@')[0]
            };

            return { user, token };
        } else {
            throw new Error('Only demo login is available. Please use demo credentials.');
        }
    } catch (error) {
        if (error instanceof FirebaseError) {
            throw new Error(error.message || 'Login failed');
        }
        throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred during login');
    }
};

export const logout = async (): Promise<void> => {
    try {
        const demoUserEmail = localStorage.getItem('user') ?
            JSON.parse(localStorage.getItem('user') || '{}').email : '';

        if (!demoUserEmail || demoUserEmail === 'demo@home24.de') {
            return;
        }


        if (isFirebaseAvailable && auth && auth.currentUser) {
            const firebaseAuth = auth as Auth;
            await signOut(firebaseAuth);
        }
    } catch (error) {
        if (error instanceof FirebaseError) {
            throw new Error(error.message || 'Logout failed');
        }
        throw new Error('An unexpected error occurred during logout');
    }
};