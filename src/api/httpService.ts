const API_URL = 'http://localhost:3001';

interface ReqOpts extends RequestInit {
    token?: string;
    params?: Record<string, string | number | boolean | undefined>;
}

export const makeRequest = async <T>(
    endpoint: string,
    options: ReqOpts = {}
): Promise<T> => {
    const { token, params, ...restOpts } = options;

    const url = new URL(`${API_URL}${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined) {
                url.searchParams.append(k, String(v));
            }
        });
    }

    const headers = new Headers({
        'Content-Type': 'application/json',
        ...restOpts.headers,
    });

    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    } else {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            headers.append('Authorization', `Bearer ${savedToken}`);
        }
    }

    try {

        const resp = await fetch(url.toString(), {
            ...restOpts,
            headers,
        });

        if (!resp.ok) {
            let errMsg = `API Error: ${resp.statusText}`;
            try {
                const errData = await resp.json();
                errMsg = errData.message || errMsg;
            } catch (jsonErr) {
                console.error(jsonErr)
                errMsg = `API error: Got a [code] [status], but couldn't parse the response JSON`;
            }
            throw new Error(errMsg);
        }

        const respData = await resp.json();
        return respData as T;
    } catch (err) {
        console.error(`API Error for ${url.toString()}:`, err);
        throw err;
    }
};

export const getStuff = <T>(endpoint: string, options: ReqOpts = {}): Promise<T> =>
    makeRequest<T>(endpoint, { ...options, method: 'GET' });

export const postStuff = <T, D extends Record<string, unknown>>(endpoint: string, data: D, options: ReqOpts = {}): Promise<T> =>
    makeRequest<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) });

export const updateStuff = <T, D extends Record<string, unknown>>(endpoint: string, data: D, options: ReqOpts = {}): Promise<T> =>
    makeRequest<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) });

export const patchStuff = <T, D extends Record<string, unknown>>(endpoint: string, data: D, options: ReqOpts = {}): Promise<T> =>
    makeRequest<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) });

export const deleteStuff = <T>(endpoint: string, options: ReqOpts = {}): Promise<T> =>
    makeRequest<T>(endpoint, { ...options, method: 'DELETE' });