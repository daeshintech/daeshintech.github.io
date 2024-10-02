import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Form, Row, Col, Spinner, Alert, Dropdown } from 'react-bootstrap';
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
                setCategories([{ id: '', name: 'All Categories' }, ...response.data]);
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

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts, selectedCategory, currentPage]);

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
        <Container fluid>
            <h2 className="my-4">Product Management</h2>
            <Row className="mb-3">
                <Col md={4}>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {selectedCategoryName}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {categories.map((category) => (
                                <Dropdown.Item key={category.id} onClick={() => handleCategoryChange(category.id, category.name)}>
                                    {category.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col md={4}>
                    <Button variant="primary" onClick={() => handleProductSelect(null)}>Add New Product</Button>
                </Col>
                <Col md={4}>
                    <Form.Control
                        type="text"
                        placeholder="Search products..."
                        onChange={handleSearch}
                    />
                </Col>
            </Row>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
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
                />
            )}
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