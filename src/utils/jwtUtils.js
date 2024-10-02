// JWT를 로컬 스토리지에 저장하고 가져오는 함수들
export const setToken = (token) => {
    localStorage.setItem('jwtToken', token); // 'jwtToken'이라는 키로 저장
};

export const getToken = () => {
    return localStorage.getItem('jwtToken'); // 'jwtToken'을 가져옴
};

export const removeToken = () => {
    localStorage.removeItem('jwtToken');
};

export const isAuthenticated = () => {
    const token = getToken();
    return !!token; // 토큰이 존재하면 true, 아니면 false 반환
};
