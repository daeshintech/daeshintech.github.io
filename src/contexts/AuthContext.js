import React, { createContext, useReducer, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    admin: false,
};

function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('jwtToken', action.payload.token);
            console.log("User logged in:", action.payload);
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                admin: action.payload.admin,
            };
        case 'LOGOUT':
            localStorage.removeItem('user');
            localStorage.removeItem('jwtToken');
            console.log("User logged out");
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                admin: false,
            };
        default:
            return state;
    }
}

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('jwtToken');
        const admin = localStorage.getItem('admin') === 'true';

        if (user && token) {
            try {
                const parsedUser = JSON.parse(user);
                dispatch({ type: 'LOGIN', payload: { user: parsedUser, token, admin } });
                console.log("User session restored:", { user: parsedUser, token, admin });
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
        setLoading(false); // 로딩이 끝났음을 표시
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
