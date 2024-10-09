import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, DropdownButton, Dropdown, Spinner, Card, Badge, Container, Row, Col, Modal } from 'react-bootstrap';
import { getAllRequests, deleteRequest } from '../../services/installationService';
import { getCategoryById } from '../../services/categoryService';
import { getProduct } from '../../services/productService';
import QuoteRequestCheck from './QuoteRequestCheck';

const UserQuoteList = () => {
    const [quotes, setQuotes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [user, setUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [quoteToDelete, setQuoteToDelete] = useState(null);

    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            setUser(JSON.parse(userJson));
        }

        fetchQuotes();
    }, [selectedType, selectedStatus]);

    const fetchQuotes = async () => {
        setLoading(true);
        try {
            const response = await getAllRequests();
            let filteredQuotes = response.data;

            if (selectedType) {
                filteredQuotes = filteredQuotes.filter(quote => quote.type === selectedType);
            }
            if (selectedStatus) {
                filteredQuotes = filteredQuotes.filter(quote => quote.status === selectedStatus);
            }

            const quotesWithDetails = await Promise.all(
                filteredQuotes.map(async (quote) => {
                    if (quote.productId) {
                        try {
                            const product = await getProduct(quote.productId);
                            const category = await getCategoryById(product.data.categoryId);
                            return {
                                ...quote,
                                productName: product.data.name,
                                categoryName: category.data.name
                            };
                        } catch (error) {
                            console.error(`Error fetching details for quote ${quote.id}:`, error);
                            return {
                                ...quote,
                                productName: 'Unknown',
                                categoryName: 'Unknown'
                            };
                        }
                    } else {
                        return {
                            ...quote,
                            productName: 'N/A',
                            categoryName: 'N/A'
                        };
                    }
                })
            );
            setQuotes(quotesWithDetails);
        } catch (err) {
            setError(`견적 요청 목록을 불러오는 데 실패했습니다: ${err}`);
        }
        setLoading(false);
    };

    const onSelectQuote = (quote) => {
        setSelectedQuote(quote);
    };

    const isAdmin = () => {
        return user && (user.role === 'SUPER' || user.role === 'ADMIN');
    };

    const typeNameMap = {
        'QUOTE': '견적',
        'CONSULTATION': '제품 문의',
        'ALL': '전체 보기'
    };

    const statusNameMap = {
        'PENDING': '대기 중',
        'PROCESSING': '처리 중',
        'COMPLETED': '완료',
        'REJECTED': '거절',
        'ALL': '전체 상태'
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'PENDING': 'warning',
            'PROCESSING': 'info',
            'COMPLETED': 'success',
            'REJECTED': 'danger'
        };
        return <Badge bg={statusMap[status] || 'secondary'}>{statusNameMap[status]}</Badge>;
    };

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

    const handleDelete = async () => {
        if (quoteToDelete) {
            try {
                await deleteRequest(quoteToDelete.id);
                setQuotes(quotes.filter(quote => quote.id !== quoteToDelete.id));
                setShowDeleteModal(false);
                setQuoteToDelete(null);
            } catch (err) {
                setError(`견적 요청 삭제에 실패했습니다: ${err}`);
            }
        }
    };

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h4 className="mb-0">견적 요청 목록</h4>
                </Card.Header>
                <Card.Body>
                    {isAdmin() && (
                        <Row className="mb-3">
                            <Col md={6}>
                                <DropdownButton id="dropdown-type" variant="outline-primary" title={typeNameMap[selectedType] || "전체 유형"}>
                                    <Dropdown.Item onClick={() => setSelectedType(null)}>전체 유형</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setSelectedType('QUOTE')}>견적</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setSelectedType('CONSULTATION')}>제품 문의</Dropdown.Item>
                                </DropdownButton>
                            </Col>
                            <Col md={6}>
                                <DropdownButton id="dropdown-status" variant="outline-secondary" title={statusNameMap[selectedStatus] || "전체 상태"}>
                                    <Dropdown.Item onClick={() => setSelectedStatus(null)}>전체 상태</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setSelectedStatus('PENDING')}>대기 중</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setSelectedStatus('PROCESSING')}>처리 중</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setSelectedStatus('COMPLETED')}>완료</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setSelectedStatus('REJECTED')}>거절</Dropdown.Item>
                                </DropdownButton>
                            </Col>
                        </Row>
                    )}
                    {loading && <Spinner animation="border" variant="primary" />}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {!selectedQuote ? (
                        isAdmin() ? (
                            <Table hover responsive className="align-middle">
                                <thead className="bg-light">
                                <tr>
                                    <th>ID</th>
                                    <th>이름</th>
                                    <th>연락처</th>
                                    <th>제품</th>
                                    <th>수량</th>
                                    <th>상태</th>
                                    <th>요청일</th>
                                    <th>액션</th>
                                </tr>
                                </thead>
                                <tbody>
                                {quotes.map((quote) => (
                                    <tr key={quote.id}>
                                        <td>{quote.id}</td>
                                        <td>{quote.name}</td>
                                        <td>{quote.phone || quote.mobile}</td>
                                        <td>{quote.productName}</td>
                                        <td>{quote.quantity}</td>
                                        <td>{getStatusBadge(quote.status)}</td>
                                        <td>{formatDateTime(quote.createdAt)}</td>
                                        <td>
                                            <Button variant="outline-info" size="sm" className="me-2" onClick={() => onSelectQuote(quote)}>
                                                상세 보기
                                            </Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => {
                                                setQuoteToDelete(quote);
                                                setShowDeleteModal(true);
                                            }}>
                                                삭제
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        ) : (
                            <QuoteRequestCheck />
                        )
                    ) : (
                        <QuoteRequestCheck initialQuote={selectedQuote} onBack={() => setSelectedQuote(null)} />
                    )}
                </Card.Body>
            </Card>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>견적 요청 삭제</Modal.Title>
                </Modal.Header>
                <Modal.Body>정말로 이 견적 요청을 삭제하시겠습니까?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        취소
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        삭제
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserQuoteList;