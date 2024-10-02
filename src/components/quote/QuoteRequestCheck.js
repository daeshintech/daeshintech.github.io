import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
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
        <div>
            <h2>견적 요청 확인</h2>
            {!quote ? (
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>휴대전화</Form.Label>
                        <Form.Control
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>비밀번호</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? '확인 중...' : '견적 요청 확인'}
                    </Button>
                </Form>
            ) : (
                <>
                    <QuoteRequestDetail quote={quote} isAdmin={isAdmin()} />
                    {onBack && (
                        <Button variant="secondary" onClick={onBack} className="mt-3">
                            목록으로 돌아가기
                        </Button>
                    )}
                </>
            )}
        </div>
    );
};

export default QuoteRequestCheck;