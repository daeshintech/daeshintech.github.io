import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Tab, Tabs, ListGroup, Image, Alert } from 'react-bootstrap';
import { createProduct, updateProduct } from '../../../services/productService';
import { createProductVariant, deleteProductVariant } from '../../../services/productVariantService';
import { uploadProductImage, deleteProductImage } from '../../../services/productImageService';

const ProductDetailModal = ({ show, onHide, product, categories, onProductUpdate }) => {
    const [formData, setFormData] = useState({ name: '', description: '', categoryId: '' });
    const [variants, setVariants] = useState([]);
    const [images, setImages] = useState([]);
    const [newVariant, setNewVariant] = useState({ sku: '', size: '', currentPrice: '', stockQuantity: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                categoryId: product.categoryId
            });
            setVariants(product.variants || []);
            setImages(product.images || []);
        } else {
            setFormData({ name: '', description: '', categoryId: '' });
            setVariants([]);
            setImages([]);
        }
        setError(null);
        setSuccess(null);
    }, [product]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            if (product) {
                await updateProduct(product.id, formData);
                setSuccess('Product updated successfully');
            } else {
                await createProduct(formData);
                setSuccess('Product created successfully');
            }
            onProductUpdate();
        } catch (error) {
            console.error('Failed to save product:', error);
            setError('Failed to save product. Please try again.');
        }
    };

    const handleVariantSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            if (product) {
                const response = await createProductVariant(product.id, newVariant);
                setVariants([...variants, response.data]);
                setNewVariant({ sku: '', size: '', currentPrice: '', stockQuantity: '' });
                setSuccess('Variant added successfully');
            }
        } catch (error) {
            console.error('Failed to add variant:', error);
            setError('Failed to add variant. Please try again.');
        }
    };

    const handleDeleteVariant = async (variantId) => {
        setError(null);
        setSuccess(null);
        try {
            await deleteProductVariant(variantId);
            setVariants(variants.filter(v => v.id !== variantId));
            setSuccess('Variant deleted successfully');
        } catch (error) {
            console.error('Failed to delete variant:', error);
            setError('Failed to delete variant. Please try again.');
        }
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (selectedFile && product) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('productId', product.id);
            try {
                const response = await uploadProductImage(formData);
                setImages([...images, response.data]);
                setSelectedFile(null);
                setSuccess('Image uploaded successfully');
            } catch (error) {
                console.error('Failed to upload image:', error);
                setError('Failed to upload image. Please try again.');
            }
        }
    };

    const handleDeleteImage = async (imageId) => {
        setError(null);
        setSuccess(null);
        try {
            await deleteProductImage(imageId);
            setImages(images.filter(img => img.id !== imageId));
            setSuccess('Image deleted successfully');
        } catch (error) {
            console.error('Failed to delete image:', error);
            setError('Failed to delete image. Please try again.');
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{product ? 'Edit Product' : 'Add New Product'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Tabs defaultActiveKey="details" id="product-tabs">
                    <Tab eventKey="details" title="Details">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Button type="submit" className="mt-3">Save Product</Button>
                        </Form>
                    </Tab>
                    <Tab eventKey="variants" title="Variants">
                        <ListGroup className="mb-3">
                            {variants.map(variant => (
                                <ListGroup.Item key={variant.id} className="d-flex justify-content-between align-items-center">
                                    <span>{variant.size} - ${variant.currentPrice} (Stock: {variant.stockQuantity})</span>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteVariant(variant.id)}>Delete</Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <Form onSubmit={handleVariantSubmit}>
                            <Form.Group>
                                <Form.Label>SKU</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newVariant.sku}
                                    onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Size</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newVariant.size}
                                    onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={newVariant.currentPrice}
                                    onChange={(e) => setNewVariant({ ...newVariant, currentPrice: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Stock Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={newVariant.stockQuantity}
                                    onChange={(e) => setNewVariant({ ...newVariant, stockQuantity: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Button type="submit" className="mt-3">Add Variant</Button>
                        </Form>
                    </Tab>
                    <Tab eventKey="images" title="Images">
                        <div className="d-flex flex-wrap mb-3">
                            {images.map(image => (
                                <div key={image.id} className="m-2 text-center">
                                    <Image src={image.imageUrl} thumbnail width={100} height={100} />
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteImage(image.id)} className="mt-1">Delete</Button>
                                </div>
                            ))}
                        </div>
                        <Form onSubmit={handleImageUpload}>
                            <Form.Group>
                                <Form.Label>Upload Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    required
                                />
                            </Form.Group>
                            <Button type="submit" className="mt-3">Upload Image</Button>
                        </Form>
                    </Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductDetailModal;