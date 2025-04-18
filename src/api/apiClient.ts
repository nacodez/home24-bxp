const BASE_URL = 'http://localhost:3001';

interface RequestOptions extends RequestInit {
    token?: string;
    params?: Record<string, string | number | boolean | undefined>;
}

export const apiRequest = async <T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> => {
    const { token, params, ...fetchOptions } = options;

    const url = new URL(`${BASE_URL}${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    const headers = new Headers({
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
    });

    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    } else {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            headers.append('Authorization', `Bearer ${storedToken}`);
        }
    }

    try {
        const response = await fetch(url.toString(), {
            ...fetchOptions,
            headers,
        });

        if (!response.ok) {
            let errorMessage = `API Error: ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                errorMessage = `API Error: Server responded with ${response.status} ${response.statusText}, but returned invalid JSON`;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();

        return data as T;
    } catch (error) {
        console.error(`API Error for ${url.toString()}:`, error);
        throw error;
    }
};

export const get = <T>(endpoint: string, options: RequestOptions = {}): Promise<T> =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' });

export const post = <T, D extends Record<string, unknown>>(endpoint: string, data: D, options: RequestOptions = {}): Promise<T> =>
    apiRequest<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) });

export const put = <T, D extends Record<string, unknown>>(endpoint: string, data: D, options: RequestOptions = {}): Promise<T> =>
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) });

export const patch = <T, D extends Record<string, unknown>>(endpoint: string, data: D, options: RequestOptions = {}): Promise<T> =>
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) });

export const del = <T>(endpoint: string, options: RequestOptions = {}): Promise<T> =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' });