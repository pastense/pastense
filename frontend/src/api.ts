import axios from 'axios';
import { PageVisit, SearchQuery, SearchResult, PageResult } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, remove it
            localStorage.removeItem('auth_token');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export const storePageVisit = async (pageVisit: PageVisit): Promise<{ status: string }> => {
    const response = await api.post('/page_visit', pageVisit);
    return response.data;
};

export const semanticSearch = async (searchQuery: SearchQuery): Promise<{ results: SearchResult[] }> => {
    const response = await api.post('/semantic_search', searchQuery);
    return response.data;
};

export const showResults = async (urls: string[]): Promise<{ results: PageResult[] }> => {
    const response = await api.post('/show_results', urls);
    return response.data;
};

export const authenticateWithGoogle = async (credential: string): Promise<{ access_token: string }> => {
    const response = await api.post('/auth/google', { credential });
    return response.data;
}; 