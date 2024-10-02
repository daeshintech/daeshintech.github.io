import axios from 'axios';
import { getToken } from './jwtUtils'; // jwtUtils에서 가져온 getToken 함수 사용

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor 통합
api.interceptors.request.use(
    (config) => {
        const token = getToken(); // 'jwtToken'을 올바르게 가져옴
        // 토큰이 있으면 Authorization 헤더에 추가
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // multipart/form-data 요청일 경우 Content-Type을 수정
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
