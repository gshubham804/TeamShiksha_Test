const API_BASE_URL = 'http://localhost:3000';

const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

export const api = {
    post: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        let responseData;
        
        try {
            const text = await response.text();
            
            if (contentType && contentType.includes('application/json')) {
                try {
                    responseData = JSON.parse(text);
                } catch (parseError) {
                    throw new Error('Invalid JSON response from server');
                }
            } else {
                // If not JSON, it's likely an error page
                throw new Error(text || 'Invalid response from server');
            }
        } catch (parseError: any) {
            if (!response.ok) {
                throw new Error(parseError.message || 'Failed to parse response');
            }
            throw parseError;
        }

        if (!response.ok) {
            throw new Error(responseData?.message || 'Something went wrong');
        }

        return responseData;
    },

    get: async (endpoint: string) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        let responseData;
        
        try {
            const text = await response.text();
            
            if (contentType && contentType.includes('application/json')) {
                try {
                    responseData = JSON.parse(text);
                } catch (parseError) {
                    throw new Error('Invalid JSON response from server');
                }
            } else {
                // If not JSON, it's likely an error page
                throw new Error(text || 'Invalid response from server');
            }
        } catch (parseError: any) {
            if (!response.ok) {
                throw new Error(parseError.message || 'Failed to parse response');
            }
            throw parseError;
        }

        if (!response.ok) {
            throw new Error(responseData?.message || 'Something went wrong');
        }

        return responseData;
    },

    put: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        let responseData;
        
        try {
            const text = await response.text();
            
            if (contentType && contentType.includes('application/json')) {
                try {
                    responseData = JSON.parse(text);
                } catch (parseError) {
                    throw new Error('Invalid JSON response from server');
                }
            } else {
                // If not JSON, it's likely an error page
                throw new Error(text || 'Invalid response from server');
            }
        } catch (parseError: any) {
            if (!response.ok) {
                throw new Error(parseError.message || 'Failed to parse response');
            }
            throw parseError;
        }

        if (!response.ok) {
            throw new Error(responseData?.message || 'Something went wrong');
        }

        return responseData;
    }
};
