import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Container, Row, Col } from 'react-bootstrap';
import { createRequest } from '../../services/installationService';
import { getAllCategories } from '../../services/categoryService';
import { getSortedAndSearchedProducts } from '../../services/productService';

const QuoteRequestForm = () => {
    const [formData, setFormData] = useState({
        type: 'QUOTE',
        categoryId: '',
        productId: '',
        quantity: '',
        name: '',
        phone: '',
        mobile: '',
        email: '',
        message: '',
        password: '',
        status: 'PENDING'
    });
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (err) {
            setError('카테고리를 불러오는데 실패했습니다.');
        }
    };

    const handleCategoryChange = async (e) => {
        const categoryId = e.target.value;
        setFormData(prev => ({ ...prev, categoryId, productId: '' }));
        setProducts([]);

        if (categoryId) {
            try {
                const productsResponse = await getSortedAndSearchedProducts('', categoryId, 'name', 'asc');
                setProducts(productsResponse.data.content);
            } catch (err) {
                setError('제품을 불러오는데 실패했습니다.');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await createRequest({
                ...formData,
                quantity: formData.quantity ? parseInt(formData.quantity) : null,
            });
            setSuccess(true);
            setFormData({
                type: 'QUOTE',
                categoryId: '',
                productId: '',
                quantity: '',
                name: '',
                phone: '',
                mobile: '',
                email: '',
                message: '',
                password: '',
                status: 'PENDING'
            });
        } catch (err) {
            setError('견적 요청 제출에 실패했습니다.');
            console.error('Error details:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Card className="shadow">
                <Card.Header as="h4" className="bg-primary text-white">견적 요청하기</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>문의 내용</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="QUOTE">견적 문의</option>
                                        <option value="CONSULTATION">제품 문의</option>
                                    </Form.Control>
                                    <Form.Text className="text-muted">
                                        기타 문의는 제품 문의로 선택 부탁드립니다.
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>이름 (회사명)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>일반전화</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

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
                                    <Form.Label>이메일</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>카테고리</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleCategoryChange}
                                        required
                                    >
                                        <option value="">카테고리를 선택하세요</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>제품</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="productId"
                                        value={formData.productId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">제품을 선택하세요</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>{product.name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>수량 (선택사항)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        min="1"
                                    />
                                    <Form.Text className="text-muted">
                                        수량이 정해지지 않았다면 비워두셔도 됩니다.
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>문의 내용</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={3}
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
                                    <Form.Text className="text-muted">
                                        이 비밀번호는 나중에 견적 요청을 확인할 때 사용됩니다.
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">견적 요청이 성공적으로 제출되었습니다.</Alert>}

                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit" size="lg" disabled={loading}>
                                {loading ? '제출 중...' : '견적 요청'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default QuoteRequestForm;