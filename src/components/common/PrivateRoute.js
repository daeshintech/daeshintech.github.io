import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function PrivateRoute({ children, requiredRoles }) {
    const { state, loading } = useAuth(); // 로딩 상태 추가

    if (loading) {
        // 로딩 중일 때 표시할 컴포넌트 (스피너 또는 로딩 메시지 등)
        return <div>Loading...</div>;
    }

    if (!state.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (requiredRoles && !requiredRoles.includes(state.user.role)) {
        return <Navigate to="/" />;
    }

    return children;
}

export default PrivateRoute;
