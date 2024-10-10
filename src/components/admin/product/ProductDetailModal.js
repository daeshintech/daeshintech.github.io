import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Tab, Tabs, ListGroup, Image, Alert, Row, Col } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { createProduct, updateProduct } from '../../../services/productService';
import { createProductVariant, deleteProductVariant } from '../../../services/productVariantService';
import { uploadProductImage, deleteProductImage, getImageUrl, getProductImages } from '../../../services/productImageService';

const ProductDetailModal = ({ show, onHide, product, categories, onProductUpdate }) => {
    const [formData, setFormData] = useState({ name: '', description: '', categoryId: '' });
    const [variants, setVariants] = useState([]);
    const [images, setImages] = useState([]);
    const [newVariant, setNewVariant] = useState({ sku: '', size: '', currentPrice: '', stockQuantity: '' });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                categoryId: product.categoryId
            });
            setVariants(product.variants || []);
            fetchProductImages(product.id);
        } else {
            setFormData({ name: '', description: '', categoryId: '' });
            setVariants([]);
            setImages([]);
            setSelectedFiles([]);
            setPreviewUrls([]);
        }
        setError(null);
        setSuccess(null);
        setIsCreating(false);
    }, [product]);

    const fetchProductImages = async (productId) => {
        try {
            const response = await getProductImages(productId);
            setImages(response.data);
        } catch (error) {
            console.error('제품 이미지를 불러오는데 실패했습니다:', error);
            setError('제품 이미지를 불러오는데 실패했습니다. 다시 시도해 주세요.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsCreating(true);
        try {
            let productId;
            if (product) {
                await updateProduct(product.id, formData);
                productId = product.id;
                setSuccess('제품이 성공적으로 업데이트되었습니다.');
            } else {
                const response = await createProduct(formData);
                productId = response.data.id;
                setSuccess('제품이 성공적으로 생성되었습니다.');
            }

            for (let file of selectedFiles) {
                await uploadProductImage(productId, file);
            }

            onProductUpdate();
            if (!product) {
                setFormData({ name: '', description: '', categoryId: '' });
                setSelectedFiles([]);
                setPreviewUrls([]);
            }
        } catch (error) {
            console.error('제품 저장에 실패했습니다:', error);
            setError('제품 저장에 실패했습니다. 다시 시도해 주세요.');
        } finally {
            setIsCreating(false);
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
                setSuccess('변형이 성공적으로 추가되었습니다.');
            }
        } catch (error) {
            console.error('변형 추가에 실패했습니다:', error);
            setError('변형 추가에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    const handleDeleteVariant = async (variantId) => {
        setError(null);
        setSuccess(null);
        try {
            await deleteProductVariant(variantId);
            setVariants(variants.filter(v => v.id !== variantId));
            setSuccess('변형이 성공적으로 삭제되었습니다.');
        } catch (error) {
            console.error('변형 삭제에 실패했습니다:', error);
            setError('변형 삭제에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);

        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (selectedFiles.length > 0 && product) {
            try {
                for (let file of selectedFiles) {
                    await uploadProductImage(product.id, file);
                }
                fetchProductImages(product.id);
                setSelectedFiles([]);
                setPreviewUrls([]);
                setSuccess('이미지가 성공적으로 업로드되었습니다.');
            } catch (error) {
                console.error('이미지 업로드에 실패했습니다:', error);
                setError('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
            }
        }
    };

    const handleDeleteImage = async (imageId) => {
        setError(null);
        setSuccess(null);
        try {
            await deleteProductImage(imageId);
            setImages(images.filter(img => img.id !== imageId));
            setSuccess('이미지가 성공적으로 삭제되었습니다.');
        } catch (error) {
            console.error('이미지 삭제에 실패했습니다:', error);
            setError('이미지 삭제에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{product ? '제품 수정' : '새 제품 추가'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Tabs defaultActiveKey="details" id="product-tabs" className="mb-3">
                        <Tab.Pane eventKey="details" title="상세 정보">
                            <Form.Group className="mb-3">
                                <Form.Label>제품명</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>설명</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>카테고리</Form.Label>
                                <Form.Select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    required
                                >
                                    <option value="">카테고리 선택</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>이미지 업로드</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    multiple
                                />
                            </Form.Group>
                            {previewUrls.length > 0 && (
                                <div className="mt-3">
                                    <h6>미리보기:</h6>
                                    <div className="d-flex flex-wrap">
                                        {previewUrls.map((url, index) => (
                                            <Image key={index} src={url} thumbnail width={100} height={100} className="m-1" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Tab.Pane>
                        {product && (
                            <>
                                <Tab.Pane eventKey="variants" title="변형">
                                    <ListGroup className="mb-3">
                                        {variants.map(variant => (
                                            <ListGroup.Item key={variant.id} className="d-flex justify-content-between align-items-center">
                                                <span>{variant.size} - ₩{variant.currentPrice} (재고: {variant.stockQuantity})</span>
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteVariant(variant.id)}>
                                                    <FaTrash /> 삭제
                                                </Button>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                    <Form onSubmit={handleVariantSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>SKU</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={newVariant.sku}
                                                        onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>크기</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={newVariant.size}
                                                        onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>가격</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={newVariant.currentPrice}
                                                        onChange={(e) => setNewVariant({ ...newVariant, currentPrice: e.target.value })}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>재고 수량</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={newVariant.stockQuantity}
                                                        onChange={(e) => setNewVariant({ ...newVariant, stockQuantity: e.target.value })}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Button type="submit" variant="success">
                                            <FaPlus /> 변형 추가
                                        </Button>
                                    </Form>
                                </Tab.Pane>
                                <Tab.Pane eventKey="images" title="이미지">
                                    <div className="d-flex flex-wrap mb-3">
                                        {images.map(image => (
                                            <div key={image.id} className="m-2 text-center">
                                                <Image src={getImageUrl(image.filename)} thumbnail width={100} height={100} />
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteImage(image.id)} className="mt-1">
                                                    <FaTrash /> 삭제
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Form onSubmit={handleImageUpload}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>추가 이미지 업로드</Form.Label>
                                            <Form.Control
                                                type="file"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                multiple
                                            />
                                        </Form.Group>
                                        {previewUrls.length > 0 && (
                                            <div className="mt-3">
                                                <h6>미리보기:</h6>
                                                <div className="d-flex flex-wrap">
                                                    {previewUrls.map((url, index) => (
                                                        <Image key={index} src={url} thumbnail width={100} height={100} className="m-1" />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <Button type="submit" variant="primary" disabled={selectedFiles.length === 0}>
                                            <FaPlus /> 이미지 업로드
                                        </Button>
                                    </Form>
                                </Tab.Pane>
                            </>
                        )}
                    </Tabs>
                    <Button type="submit" variant="primary" className="mt-3" disabled={isCreating}>
                        {isCreating ? '처리 중...' : (product ? '제품 수정' : '제품 생성')}
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>닫기</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductDetailModal;