import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import useLogin from '../../hooks/useLogin';

const LoginForm = () => {
    const {
        username,
        setUsername,
        password,
        setPassword,
        handleSubmit
    } = useLogin();

    return (
        <Container>
            <h2>로그인</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>아이디</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="아이디를 입력하세요"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    로그인
                </Button>
            </Form>
        </Container>
    );
};

export default LoginForm;
