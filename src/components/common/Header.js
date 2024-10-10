import React, { useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Header() {
    const { state, dispatch } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("State updated in Header:", state);
    }, [state]);

    const handleLogout = () => {
        console.log("Logout initiated");
        dispatch({ type: 'LOGOUT' });
        navigate('/');
    };

    const isAdminOrSuper = state.user && (state.user.role === 'ADMIN' || state.user.role === 'SUPER');

    const UserButton = ({ username }) => (
        <div className="d-flex flex-column align-items-center" style={{ width: '120px' }}>
            <Button
                variant="outline-primary"
                className="w-100 mb-1"
                style={{
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    padding: '0.25rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}
            >
                {username}
            </Button>
            <Button
                variant="outline-danger"
                className="w-100"
                size="sm"
                onClick={handleLogout}
                style={{
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    padding: '0.25rem'
                }}
            >
                로그아웃
            </Button>
        </div>
    );

    const LoginRegisterButtons = () => (
        <div className="d-flex flex-column align-items-center" style={{ width: '120px' }}>
            <Button
                as={Link}
                to="/login"
                variant="outline-primary"
                className="w-100 mb-1"
                style={{
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    padding: '0.25rem'
                }}
            >
                로그인
            </Button>
            <Button
                as={Link}
                to="/register"
                variant="outline-secondary"
                className="w-100"
                size="sm"
                style={{
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    padding: '0.25rem'
                }}
            >
                회원가입
            </Button>
        </div>
    );

    return (
        <Navbar bg="white" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/" className="font-weight-bold">DS Tech.</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/products" className="mx-2">제품</Nav.Link>
                        <Nav.Link as={Link} to="/quotes" className="mx-2">견적/문의</Nav.Link>
                        <Nav.Link as={Link} to="/portfolio" className="mx-2">시공사례</Nav.Link>
                        {/*<Nav.Link as={Link} to="/services" className="mx-2">서비스</Nav.Link>*/}
                        {isAdminOrSuper && (
                            <Nav.Link as={Link} to="/admin" className="mx-2">관리/통계</Nav.Link>
                        )}
                    </Nav>
                    <Nav className="align-items-center">
                        {state.isAuthenticated && state.user ? (
                            <UserButton username={state.user.username} />
                        ) : (
                            <LoginRegisterButtons />
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;