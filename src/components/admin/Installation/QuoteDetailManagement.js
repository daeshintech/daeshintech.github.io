// src/components/quote/QuoteDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import { getRequestById, updateRequest } from '../../../services/installationService';
import { getProduct } from '../../../services/productService';

const QuoteDetailPage = () => {
    const { id } = useParams();
    const [quote, setQuote] = useState({});
    const [adminComment, setAdminComment] = useState('');
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [productName, setProductName] = useState('');

    useEffect(() => {
        const fetchQuoteDetails = async () => {
            try {
                const quoteResponse = await getRequestById(id);
                const productResponse = await getProduct(quoteResponse.data.productId);
                setQuote(quoteResponse.data);
                setAdminComment(quoteResponse.data.adminResponse || '');
                setStatus(quoteResponse.data.status);
                setType(quoteResponse.data.type);
                setProductName(productResponse.data.name);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('견적 요청 정보를 불러오는 데 실패했습니다.');
            }
        };
        fetchQuoteDetails();
    }, [id]);

    const handleCommentChange = (e) => setAdminComment(e.target.value);
    const handleStatusChange = (e) => setStatus(e.target.value);
    const handleTypeChange = (e) => setType(e.target.value);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'PENDING': 'warning',
            'PROCESSING': 'info',
            'COMPLETED': 'success',
            'REJECTED': 'danger'
        };
        return <Badge bg={statusMap[status] || 'secondary'}>{status}</Badge>;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            await updateRequest(quote.id, {
                adminResponse: adminComment,
                status,
                type
            });
            setSuccess(true);
        } catch (err) {
            setError('업데이트에 실패했습니다.');
            console.error('Update error:', err);
        }
    };

    if (!quote || quote.id == null) {
        return <Alert variant="danger">견적 요청 정보가 유효하지 않습니다.</Alert>;
    }

    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">견적 요청 #{quote.id}</h4>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={6}>
                        <h5>요청자 정보</h5>
                        <p><strong>이름 (회사명):</strong> {quote.name}</p>
                        <p><strong>일반전화:</strong> {quote.phone}</p>
                        <p><strong>휴대전화:</strong> {quote.mobile}</p>
                        <p><strong>이메일:</strong> {quote.email}</p>
                    </Col>
                    <Col md={6}>
                        <h5>요청 상세</h5>
                        <p><strong>문의 유형:</strong> {type}</p>
                        <p><strong>제품명:</strong> {productName}</p>
                        <p><strong>수량:</strong> {quote.quantity}</p>
                        <p><strong>상태:</strong> {getStatusBadge(status)}</p>
                        <p><strong>요청일시:</strong> {formatDateTime(quote.createdAt)}</p>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <h5>메시지</h5>
                        <p>{quote.message}</p>
                    </Col>
                </Row>
                <Form onSubmit={handleSubmit} className="mt-4">
                    <Form.Group className="mb-3">
                        <Form.Label>관리자 코멘트</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={adminComment}
                            onChange={handleCommentChange}
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>상태 변경</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={status}
                                    onChange={handleStatusChange}
                                >
                                    <option value="PENDING">대기 중</option>
                                    <option value="PROCESSING">처리 중</option>
                                    <option value="COMPLETED">완료</option>
                                    <option value="REJECTED">거절</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>문의 유형 변경</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={type}
                                    onChange={handleTypeChange}
                                >
                                    <option value="QUOTE">견적 문의</option>
                                    <option value="CONSULTATION">제품 문의</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">업데이트가 성공적으로 완료되었습니다.</Alert>}

                    <Button variant="primary" type="submit">
                        업데이트
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default QuoteDetailPage;
