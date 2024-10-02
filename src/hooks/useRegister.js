import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const useRegister = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        try {
            const response = await api.post('/api/v1/auth/register', {
                username,
                email,
                full_name: fullName,
                password
            });
            console.log('Registration successful:', response.data);
            navigate('/login'); // 등록 성공 후 로그인 페이지로 이동
        } catch (error) {
            console.error('Registration failed:', error.response?.data);
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return {
        username,
        setUsername,
        email,
        setEmail,
        fullName,
        setFullName,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        handleSubmit
    };
};

export default useRegister;