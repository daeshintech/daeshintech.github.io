import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Form, Row, Col, Spinner, Alert, Dropdown, Card } from 'react-bootstrap';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { getSortedAndSearchedProducts, deleteProduct } from '../../../services/productService';
import { getAllCategories } from '../../../services/categoryService';
import ProductList from './ProductList';
import ProductDetailModal from './ProductDetailModal';
import { debounce } from 'lodash';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCategoryName, setSelectedCategoryName] = useState('All Categories');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getSortedAndSearchedProducts(searchTerm, selectedCategory, sortField, sortDirection, currentPage, 10);
            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            setError('Failed to fetch products. Please try again.');
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, sortField, sortDirection, searchTerm, selectedCategory]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories();
                setCategories([{ id: '', name: '전체' }, ...response.data]);
            } catch (error) {
                setError('Failed to fetch categories. Please try again.');
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryChange = useCallback((categoryId, categoryName) => {
        setSelectedCategory(categoryId);
        setSelectedCategoryName(categoryName || 'All Categories');
        setCurrentPage(1);
    }, []);

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(productId);
                fetchProducts();
            } catch (error) {
                setError('Failed to delete product. Please try again.');
                console.error('Failed to delete product:', error);
            }
        }
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setShowDetailModal(true);
    };

    const handleProductUpdate = () => {
        fetchProducts();
        setShowDetailModal(false);
    };

    const debouncedSearch = useCallback(
        debounce((value) => {
            setSearchTerm(value);
            setCurrentPage(1);
        }, 300),
        []
    );

    const handleSearch = (event) => {
        debouncedSearch(event.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm">
                <Card.Body>
                    <h2 className="mb-4">제품 관리</h2>
                    <Row className="mb-4 align-items-end">
                        <Col md={4} className="mb-3 mb-md-0">
                            <Form.Group>
                                <Form.Label>카테고리</Form.Label>
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" className="w-100">
                                        {selectedCategoryName}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="w-100">
                                        {categories.map((category) => (
                                            <Dropdown.Item key={category.id} onClick={() => handleCategoryChange(category.id, category.name)}>
                                                {category.name}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form.Group>
                        </Col>
                        <Col md={4} className="mb-3 mb-md-0">
                            <Button variant="primary" onClick={() => handleProductSelect(null)} className="w-100">
                                <FaPlus className="me-2" /> 새 제품 추가
                            </Button>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>검색</Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        type="text"
                                        placeholder="제품 검색..."
                                        onChange={handleSearch}
                                    />
                                    <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
                    {loading ? (
                        <div className="text-center my-5">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">로딩 중...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <ProductList
                            products={products}
                            categories={categories}
                            onProductSelect={handleProductSelect}
                            onDelete={handleDeleteProduct}
                            onSort={setSortField}
                            sortField={sortField}
                            sortDirection={sortDirection}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </Card.Body>
            </Card>
            <ProductDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                product={selectedProduct}
                categories={categories}
                onProductUpdate={handleProductUpdate}
            />
        </Container>
    );
};

export default ProductManagement;