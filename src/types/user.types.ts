export interface User {
    id: string;
    email: string;
    name: string;
}

export interface LoginCreds {
    email: string;
    password: string;
}

export interface UserState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
