import {
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
    Auth
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth, isFirebaseAvailable } from '../firebase/config';
import { User, LoginCreds } from '../types/user.types';

export const doLogin = async (creds: LoginCreds): Promise<{ user: User, token: string }> => {
    try {
        // Hardcoded Demo user for testing purpose
        if (creds.email === 'demo@home24.de' && creds.password === 'password') {
            const demoUsr: User = {
                id: 'demo-user-id',
                email: 'demo@home24.de',
                name: 'Demo User'
            };
            return { user: demoUsr, token: 'demo-token-123456' };
        }

        if (isFirebaseAvailable && auth) {
            // Regular Firebase authentication for non-demo users
            const fbAuth = auth as Auth;
            const userCred: UserCredential = await signInWithEmailAndPassword(
                fbAuth,
                creds.email,
                creds.password
            );

            const token = await userCred.user.getIdToken();

            const user: User = {
                id: userCred.user.uid,
                email: userCred.user.email || '',
                name: userCred.user.displayName || creds.email.split('@')[0]
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

export const doLogout = async (): Promise<void> => {
    try {
        const demoEmail = localStorage.getItem('user') ?
            JSON.parse(localStorage.getItem('user') || '{}').email : '';

        if (!demoEmail || demoEmail === 'demo@home24.de') {
            return;
        }

        if (isFirebaseAvailable && auth && auth.currentUser) {
            const fbAuth = auth as Auth;
            await signOut(fbAuth);
        }
    } catch (error) {
        if (error instanceof FirebaseError) {
            throw new Error(error.message || 'Logout failed');
        }
        throw new Error('An unexpected error occurred during logout');
    }
};