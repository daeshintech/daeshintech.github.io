import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { setToken } from '../utils/jwtUtils'; // 토큰 저장 함수 임포트

const useLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { dispatch } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post('/api/v1/auth/login', {
                username,
                password
            });

            const userData = response.data;
            if (userData && userData.token) {
                setToken(userData.token);

                // user 정보를 명확하게 전달 (username, role, id)
                const user = {
                    id: userData.id,
                    username: userData.username,
                    role: userData.role,
                };

                console.log('Login successful, dispatching LOGIN action', userData);
                dispatch({ type: 'LOGIN', payload: { user, token: userData.token, admin: userData.admin } });
                navigate('/');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        handleSubmit
    };
};

export default useLogin;
