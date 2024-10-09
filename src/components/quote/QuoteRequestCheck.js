import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import { checkRequest, getRequestById } from '../../services/installationService';
import QuoteRequestDetail from './QuoteRequestDetail';

const QuoteRequestCheck = ({ initialQuote, onBack }) => {
    const [formData, setFormData] = useState({ mobile: '', password: '' });
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            setUser(JSON.parse(userJson));
        }

        if (initialQuote) {
            setQuote(initialQuote);
        }
    }, [initialQuote]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setQuote(null);

        try {
            let response;
            if (isAdmin() && initialQuote) {
                response = await getRequestById(initialQuote.id);
            } else {
                response = await checkRequest(formData.mobile, formData.password);
            }

            if (response.data && typeof response.data === 'object') {
                setQuote(response.data);
            } else {
                throw new Error('Invalid response data');
            }
        } catch (err) {
            setError('견적 요청을 찾을 수 없습니다. 정보를 확인해주세요.');
            console.error('Check request error:', err);
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = () => {
        return user && (user.role === 'SUPER' || user.role === 'ADMIN');
    };

    return (
        <Container className="py-5">
            <Card className="shadow">
                <Card.Header as="h4" className="bg-primary text-white">견적 요청 확인</Card.Header>
                <Card.Body>
                    {!quote ? (
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>휴대전화</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            required
                                            placeholder="010-0000-0000"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>비밀번호</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="견적 요청 시 입력한 비밀번호"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <div className="d-grid gap-2">
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? <Spinner animation="border" size="sm" /> : '견적 요청 확인'}
                                </Button>
                            </div>
                        </Form>
                    ) : (
                        <>
                            <QuoteRequestDetail quote={quote} isAdmin={isAdmin()} />
                            {onBack && (
                                <div className="mt-3">
                                    <Button variant="outline-secondary" onClick={onBack}>
                                        목록으로 돌아가기
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default QuoteRequestCheck;