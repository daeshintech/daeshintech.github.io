import React, { useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Header() {
    const { state, dispatch } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("State updated in Header:", state); // 상태 변화 감지 로그
    }, [state]);

    const handleLogout = () => {
        console.log("Logout initiated"); // 로그아웃 버튼 클릭 로그
        dispatch({ type: 'LOGOUT' });
        navigate('/');
    };

    const isAdminOrSuper = state.user && (state.user.role === 'ADMIN' || state.user.role === 'SUPER');

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">DS Tech.</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/products">제품</Nav.Link>
                        <Nav.Link as={Link} to="/quotes">견적/문의</Nav.Link>
                        <Nav.Link as={Link} to="/services">서비스</Nav.Link>
                        {isAdminOrSuper && (
                            <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        {state.isAuthenticated && state.user ? (
                            <>
                                <Nav.Link as={Link} to="/profile">{state.user.username}</Nav.Link>
                                <Nav.Link onClick={handleLogout}>로그아웃</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">로그인</Nav.Link>
                                <Nav.Link as={Link} to="/register">회원가입</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
