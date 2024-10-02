import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Button, Carousel, Dropdown, Container, Row, Col, Card, Form, Pagination } from 'react-bootstrap';
import { getProducts, getSortedAndSearchedProducts } from '../services/productService';
import { getAllCategories } from '../services/categoryService';

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

    const fetchCategories = useCallback(async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to load categories:', error);
            setError('Failed to load categories.');
        }
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            let response;
            if (selectedCategory || searchTerm) {
                response = await getSortedAndSearchedProducts(searchTerm, selectedCategory ? selectedCategory.id : null, 'name', 'asc', currentPage, 10);
            } else {
                response = await getProducts(currentPage);
            }
            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Failed to load products:', error);
            setError('Failed to load products.');
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, searchTerm, currentPage]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

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

    return (
        <Container>
            <Row className="mt-3">
                <Col md={3}>
                    <Dropdown onSelect={(eventKey) => handleCategorySelect(categories.find(cat => cat.id === parseInt(eventKey)))}>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            {selectedCategory ? selectedCategory.name : 'Select Category'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item key="all" onClick={() => handleCategorySelect(null)}>All Categories</Dropdown.Item>
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
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                        className="form-control"
                    />
                </Col>
            </Row>

            <Row className="mt-4">
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                {loading ? (
                    <Col>
                        <p>Loading...</p>
                    </Col>
                ) : products.length > 0 ? (
                    products.map(product => (
                        <Col sm={6} md={4} lg={3} key={product.id} className="mb-4">
                            <Card onClick={() => handleProductSelect(product)} className="h-100">
                                <Card.Img
                                    variant="top"
                                    src={product.images && product.images.length > 0 ? product.images[0].imageUrl : 'https://via.placeholder.com/150'}
                                    alt={product.name}
                                />
                                <Card.Body>
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Text>{product.description}</Card.Text>
                                    {product.category && <Card.Text className="text-muted">Category: {product.category.name}</Card.Text>}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <p>No products found matching the criteria.</p>
                    </Col>
                )}
            </Row>

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

            {selectedProduct && (
                <Modal show={showModal} onHide={closeModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedProduct.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Carousel>
                            {selectedProduct.images && selectedProduct.images.map((image, index) => (
                                <Carousel.Item key={index}>
                                    <img
                                        className="d-block w-100"
                                        src={image.imageUrl}
                                        alt={`Image ${index + 1}`}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                        <p>{selectedProduct.description}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default ProductShowcase;