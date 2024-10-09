import axios from 'axios';
import { getToken } from './jwtUtils';

const api = axios.create({
    // baseURL: process.env.REACT_APP_API_URL,  // 환경 변수 사용
    baseURL: 'https://daeshin.duckdns.org/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // 여기서 로그아웃 처리를 할 수 있습니다.
        }
        if (error.response && error.response.status === 403) {
            // 접근 권한 오류 처리
        }
        return Promise.reject(error);
    }
);

export default api;