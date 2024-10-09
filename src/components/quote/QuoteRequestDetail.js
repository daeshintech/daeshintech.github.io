import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Row, Col, Badge, Container } from 'react-bootstrap';
import { updateRequest } from '../../services/installationService';
import { getProduct } from '../../services/productService';

const QuoteRequestDetail = ({ quote, isAdmin }) => {
    const [adminComment, setAdminComment] = useState(quote.adminResponse || '');
    const [status, setStatus] = useState(quote.status);
    const [type, setType] = useState(quote.type);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [productName, setProductName] = useState('');

    useEffect(() => {
        fetchProductName();
    }, [quote.productId]);

    const fetchProductName = async () => {
        if (quote.productId) {
            try {
                const response = await getProduct(quote.productId);
                setProductName(response.data.name);
            } catch (err) {
                console.error('Error fetching product name:', err);
                setProductName('제품 정보 없음');
            }
        }
    };

    if (!quote || quote.id == null) {
        return <Alert variant="danger">견적 요청 정보가 유효하지 않습니다.</Alert>;
    }

    const handleCommentChange = (e) => setAdminComment(e.target.value);
    const handleStatusChange = (e) => setStatus(e.target.value);
    const handleTypeChange = (e) => setType(e.target.value);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        if (date instanceof Date && !isNaN(date)) {
            return date.toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }
        return '날짜 정보 없음';
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
        setError(null);
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

    return (
        <Container className="py-4">
            <Card className="shadow">
                <Card.Header className="bg-primary text-white">
                    <h4 className="mb-0">견적 요청 #{quote.id}</h4>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-4">
                        <Col md={6}>
                            <Card>
                                <Card.Header as="h5">요청자 정보</Card.Header>
                                <Card.Body>
                                    <p><strong>이름 (회사명):</strong> {quote.name}</p>
                                    <p><strong>일반전화:</strong> {quote.phone || '정보 없음'}</p>
                                    <p><strong>휴대전화:</strong> {quote.mobile}</p>
                                    <p><strong>이메일:</strong> {quote.email}</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card>
                                <Card.Header as="h5">요청 상세</Card.Header>
                                <Card.Body>
                                    <p><strong>문의 유형:</strong> {type === 'QUOTE' ? '견적 문의' : '제품 문의'}</p>
                                    <p><strong>제품명:</strong> {productName}</p>
                                    <p><strong>수량:</strong> {quote.quantity || '정보 없음'}</p>
                                    <p><strong>상태:</strong> {getStatusBadge(status)}</p>
                                    <p><strong>요청일시:</strong> {formatDateTime(quote.createdAt)}</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Card className="mb-4">
                        <Card.Header as="h5">메시지</Card.Header>
                        <Card.Body>
                            <p>{quote.message}</p>
                        </Card.Body>
                    </Card>

                    {quote.adminResponse && (
                        <Card className="mb-4">
                            <Card.Header as="h5">관리자 응답</Card.Header>
                            <Card.Body>
                                <p>{quote.adminResponse}</p>
                            </Card.Body>
                        </Card>
                    )}

                    {isAdmin && (
                        <Form onSubmit={handleSubmit}>
                            <Card>
                                <Card.Header as="h5">관리자 응답</Card.Header>
                                <Card.Body>
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
                                                <Form.Select
                                                    value={status}
                                                    onChange={handleStatusChange}
                                                >
                                                    <option value="PENDING">대기 중</option>
                                                    <option value="PROCESSING">처리 중</option>
                                                    <option value="COMPLETED">완료</option>
                                                    <option value="REJECTED">거절</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>문의 유형 변경</Form.Label>
                                                <Form.Select
                                                    value={type}
                                                    onChange={handleTypeChange}
                                                >
                                                    <option value="QUOTE">견적 문의</option>
                                                    <option value="CONSULTATION">제품 문의</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {error && <Alert variant="danger">{error}</Alert>}
                                    {success && <Alert variant="success">업데이트가 성공적으로 완료되었습니다.</Alert>}

                                    <div className="d-grid gap-2">
                                        <Button variant="primary" type="submit">
                                            업데이트
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default QuoteRequestDetail;