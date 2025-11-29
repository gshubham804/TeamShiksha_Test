const API_BASE_URL = 'http://localhost:3000';

export const api = {
    post: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Something went wrong');
        }

        return responseData;
    },

    get: async (endpoint: string) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Something went wrong');
        }

        return responseData;
    }
};
