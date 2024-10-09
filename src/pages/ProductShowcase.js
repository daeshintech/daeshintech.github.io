import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Button, Carousel, Dropdown, Container, Row, Col, Card, Form, Pagination, Spinner, Alert } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { getProducts, getSortedAndSearchedProducts } from '../services/productService';
import { getAllCategories } from '../services/categoryService';
import { getProductImages, getImageUrl } from '../services/productImageService';

const ProductShowcase = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [productImages, setProductImages] = useState({});

    const location = useLocation();

    const fetchCategories = useCallback(async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('카테고리 로딩 실패:', error);
            setError('카테고리를 불러오는데 실패했습니다.');
        }
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            let response;
            if (selectedCategory || searchTerm) {
                response = await getSortedAndSearchedProducts(searchTerm, selectedCategory ? selectedCategory.id : null, 'name', 'asc', currentPage, 12);
            } else {
                response = await getProducts(currentPage, 12);
            }
            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);

            const imagePromises = response.data.content.map(product => getProductImages(product.id));
            const imageResponses = await Promise.all(imagePromises);
            const newProductImages = {};
            imageResponses.forEach((imgResponse, index) => {
                const productId = response.data.content[index].id;
                newProductImages[productId] = imgResponse.data;
            });
            setProductImages(newProductImages);
        } catch (error) {
            console.error('제품 로딩 실패:', error);
            setError('제품을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, searchTerm, currentPage]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const categoryId = searchParams.get('category');
        if (categoryId) {
            const category = categories.find(cat => cat.id === parseInt(categoryId));
            if (category) {
                setSelectedCategory(category);
            }
        }
    }, [location, categories]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts, selectedCategory]);

    const handleSearchTermChange = useCallback((e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    }, []);

    const handleCategorySelect = useCallback((category) => {
        setSelectedCategory(category);
        setSearchTerm('');
        setCurrentPage(1);
    }, []);

    const handleProductSelect = useCallback((product) => {
        setSelectedProduct(product);
        setShowModal(true);
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false);
    }, []);

    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
    }, []);

    const cardStyle = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    };

    const imageStyle = {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
    };

    const cardBodyStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    };

    const cardTitleStyle = {
        height: '50px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
    };

    const cardTextStyle = {
        flex: 1,
        overflow: 'hidden',
    };

    return (
        <Container className="py-4">
            <Row className="mb-4">
                <Col md={3}>
                    <Dropdown onSelect={(eventKey) => handleCategorySelect(categories.find(cat => cat.id === parseInt(eventKey)))}>
                        <Dropdown.Toggle variant="outline-primary" id="dropdown-basic" className="w-100">
                            {selectedCategory ? selectedCategory.name : '카테고리 선택'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="w-100">
                            <Dropdown.Item key="all" onClick={() => handleCategorySelect(null)}>전체 카테고리</Dropdown.Item>
                            {categories.map(category => (
                                <Dropdown.Item key={category.id} eventKey={category.id}>
                                    {category.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col md={9}>
                    <Form.Control
                        type="text"
                        placeholder="제품 검색..."
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                        className="form-control"
                    />
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">로딩중...</span>
                    </Spinner>
                </div>
            ) : products.length > 0 ? (
                <Row>
                    {products.map(product => (
                        <Col sm={6} md={4} lg={3} key={product.id} className="mb-4">
                            <Card
                                onClick={() => handleProductSelect(product)}
                                style={cardStyle}
                                className="h-100 shadow-sm"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)';
                                }}
                            >
                                <div style={{ height: '200px', overflow: 'hidden' }}>
                                    <Card.Img
                                        variant="top"
                                        src={productImages[product.id] && productImages[product.id].length > 0
                                            ? getImageUrl(productImages[product.id][0].filename)
                                            : getImageUrl('placeholder-image.jpg')}
                                        alt={product.name}
                                        style={imageStyle}
                                    />
                                </div>
                                <Card.Body style={cardBodyStyle}>
                                    <Card.Title style={cardTitleStyle}>{product.name}</Card.Title>
                                    <Card.Text style={cardTextStyle}>{product.description}</Card.Text>
                                    {product.category && (
                                        <Card.Text className="text-muted mt-auto">
                                            카테고리: {product.category.name}
                                        </Card.Text>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p className="text-center">검색 조건에 맞는 제품이 없습니다.</p>
            )}

            {totalPages > 1 && (
                <Row className="mt-4">
                    <Col className="d-flex justify-content-center">
                        <Pagination>
                            {[...Array(totalPages).keys()].map(number => (
                                <Pagination.Item
                                    key={number + 1}
                                    active={number + 1 === currentPage}
                                    onClick={() => handlePageChange(number + 1)}
                                >
                                    {number + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </Col>
                </Row>
            )}

            <Modal show={showModal} onHide={closeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedProduct?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel>
                        {selectedProduct && productImages[selectedProduct.id]?.map((image, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100"
                                    src={getImageUrl(image.filename)}
                                    alt={`이미지 ${index + 1}`}
                                    style={{ height: '400px', objectFit: 'contain' }}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                    <p className="mt-3">{selectedProduct?.description}</p>
                    {selectedProduct?.category && (
                        <p className="text-muted">카테고리: {selectedProduct.category.name}</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>닫기</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProductShowcase;