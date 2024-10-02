import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, DropdownButton, Dropdown, Spinner } from 'react-bootstrap';
import { getAllRequests } from '../../services/installationService';
import { getCategoryById } from '../../services/categoryService';
import { getProduct } from '../../services/productService';
import QuoteRequestCheck from './QuoteRequestCheck';

const UserQuoteList = () => {
    const [quotes, setQuotes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // localStorage에서 사용자 정보 가져오기
        const userJson = localStorage.getItem('user');
        if (userJson) {
            setUser(JSON.parse(userJson));
        }

        const fetchQuotes = async () => {
            setLoading(true);
            try {
                const response = await getAllRequests();
                const filteredQuotes = selectedType ? response.data.filter(quote => quote.type === selectedType) : response.data;
                const quotesWithDetails = await Promise.all(
                    filteredQuotes.map(async (quote) => {
                        const product = await getProduct(quote.productId);
                        const category = await getCategoryById(product.data.categoryId);
                        return {
                            ...quote,
                            productName: product.data.name,
                            categoryName: category.data.name
                        };
                    })
                );
                setQuotes(quotesWithDetails);
            } catch (err) {
                setError(`견적 요청 목록을 불러오는 데 실패했습니다: ${err}`);
            }
            setLoading(false);
        };

        fetchQuotes();
    }, [selectedType]);

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

    return (
        <div>
            <h2 className="mb-4">견적 요청 목록</h2>
            {isAdmin() && (
                <DropdownButton id="dropdown-basic-button" title={typeNameMap[selectedType] || "전체 보기"}>
                    <Dropdown.Item onClick={() => setSelectedType(null)}>전체 보기</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedType('QUOTE')}>견적</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedType('CONSULTATION')}>제품 문의</Dropdown.Item>
                </DropdownButton>
            )}
            {loading && <Spinner animation="border" variant="primary" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {!selectedQuote ? (
                isAdmin() ? (
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>요청 ID</th>
                            <th>카테고리</th>
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
                                <td>{quote.categoryName}</td>
                                <td>{quote.productName}</td>
                                <td>{quote.quantity}</td>
                                <td>{quote.status}</td>
                                <td>{new Date(quote.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <Button variant="info" size="sm" onClick={() => onSelectQuote(quote)}>
                                        상세 보기
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
        </div>
    );
};

export default UserQuoteList;