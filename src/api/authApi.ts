import {
    signInWithEmailAndPassword,
    signOut,
    UserCredential
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../firebase/config';
import { User, LoginCredentials } from '../types/auth.types';

export const login = async (credentials: LoginCredentials): Promise<{ user: User, token: string }> => {
    try {
        // Special case for demo user
        if (credentials.email === 'demo@home24.de' && credentials.password === 'password') {

            const demoUser: User = {
                id: 'demo-user-id',
                email: 'demo@home24.de',
                name: 'Demo User'
            };
            return { user: demoUser, token: 'demo-token-123456' };
        }

        // Regular Firebase authentication for other users
        const userCredential: UserCredential = await signInWithEmailAndPassword(
            auth,
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
    } catch (error) {
        if (error instanceof FirebaseError) {
            throw new Error(error.message || 'Login failed');
        }
        throw new Error('An unexpected error occurred during login');
    }
};

export const logout = async (): Promise<void> => {
    try {
        const user = auth.currentUser;
        if (!user || user.email === 'demo@home24.de') {
            return;
        }

        await signOut(auth);
    } catch (error) {
        if (error instanceof FirebaseError) {
            throw new Error(error.message || 'Logout failed');
        }
        throw new Error('An unexpected error occurred during logout');
    }
};