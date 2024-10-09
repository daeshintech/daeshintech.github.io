import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getRootCategories } from '../services/categoryService';
import { getSortedAndSearchedProducts } from '../services/productService';
import { getProductImages, getImageUrl } from '../services/productImageService';

function Home() {
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [productImages, setProductImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const categoriesResponse = await getRootCategories();
                setCategories(categoriesResponse.data);

                const productsResponse = await getSortedAndSearchedProducts('', '', 'updatedAt', 'desc', 1, 5);
                setFeaturedProducts(productsResponse.data.content);

                const imagesPromises = productsResponse.data.content.map(product =>
                    getProductImages(product.id)
                );
                const imagesResponses = await Promise.all(imagesPromises);
                const images = {};
                imagesResponses.forEach((response, index) => {
                    const productId = productsResponse.data.content[index].id;
                    images[productId] = response.data[0]?.filename || null;
                });
                setProductImages(images);

                // Fetch one product for each category
                const categoryProductsPromises = categoriesResponse.data.map(category =>
                    getSortedAndSearchedProducts('', category.id, 'updatedAt', 'desc', 1, 1)
                );
                const categoryProductsResponses = await Promise.all(categoryProductsPromises);
                const categoryImages = {};
                for (let i = 0; i < categoryProductsResponses.length; i++) {
                    const product = categoryProductsResponses[i].data.content[0];
                    if (product) {
                        const imageResponse = await getProductImages(product.id);
                        categoryImages[categoriesResponse.data[i].id] = imageResponse.data[0]?.filename || null;
                    }
                }
                setProductImages(prevImages => ({ ...prevImages, ...categoryImages }));

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('데이터를 불러오는 데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Container className="mt-4"><h2>로딩 중...</h2></Container>;
    if (error) return <Container className="mt-4"><h2>{error}</h2></Container>;

    const imageStyle = {
        width: '100%',
        height: '300px',
        objectFit: 'cover',
    };

    const ErrorMessage = ({ message }) => (
        <div style={{
            ...imageStyle,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            padding: '20px',
            textAlign: 'center'
        }}>
            <p style={{ margin: 0 }}>{message}</p>
        </div>
    );

    return (
        <Container fluid className="p-0">
            <Carousel fade>
                {featuredProducts.map(product => (
                    <Carousel.Item key={product.id}>
                        {productImages[product.id] ? (
                            <img
                                className="d-block w-100"
                                src={getImageUrl(productImages[product.id])}
                                alt={product.name}
                                style={imageStyle}
                                onError={() => {
                                    setProductImages(prev => ({...prev, [product.id]: null}));
                                }}
                            />
                        ) : (
                            <ErrorMessage message="이미지를 불러올 수 없습니다." />
                        )}
                        <Carousel.Caption>
                            <h3>{product.name}</h3>
                            <p>{product.description.substring(0, 100)}...</p>
                            <Button as={Link} to={`/products/${product.id}`} variant="primary">제품 상세 보기</Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>

            <Container className="my-5">
                <Row className="mb-5">
                    <Col>
                        <h1 className="text-primary">대신기술개발에 오신 것을 환영합니다</h1>
                        <p className="lead">
                            대신기술개발은 혁신적인 기술 솔루션을 제공하는 선도적인 기업입니다.
                            우리는 고객의 요구를 충족시키고 미래를 선도하는 제품을 개발하기 위해 끊임없이 노력하고 있습니다.
                        </p>
                        <Button as={Link} to="/about" variant="outline-primary">자세히 알아보기</Button>
                    </Col>
                </Row>

                <h2 className="text-center mb-4">제품 카테고리</h2>
                <Row className="mb-5">
                    {categories.map(category => (
                        <Col md={4} key={category.id} className="mb-3">
                            <Card className="h-100">
                                {productImages[category.id] ? (
                                    <Card.Img
                                        variant="top"
                                        src={getImageUrl(productImages[category.id])}
                                        style={imageStyle}
                                        onError={() => {
                                            setProductImages(prev => ({...prev, [category.id]: null}));
                                        }}
                                    />
                                ) : (
                                    <ErrorMessage message="카테고리 대표 이미지를 불러올 수 없습니다." />
                                )}
                                <Card.Body>
                                    <Card.Title>{category.name}</Card.Title>
                                    <Card.Text>{category.description}</Card.Text>
                                    <Button as={Link} to={`/categories/${category.id}`} variant="primary">카테고리 보기</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <div className="text-center mb-5">
                    <Button as={Link} to="/products" variant="primary" size="lg">모든 제품 보기</Button>
                </div>

                <Row className="my-5 py-5 bg-light rounded">
                    <Col className="text-center">
                        <h2>혁신적인 기술 솔루션이 필요하신가요?</h2>
                        <p className="lead">대신기술개발의 전문가들이 도와드리겠습니다.</p>
                        <Button as={Link} to="/contact" variant="primary" size="lg">문의하기</Button>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default Home;