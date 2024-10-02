import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllCategories } from '../services/categoryService';
import { getProducts } from '../services/productService';
import { getProductImages } from '../services/productImageService';

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
                const [categoriesResponse, productsResponse] = await Promise.all([
                    getAllCategories(),
                    getProducts(1, 5)  // 첫 페이지의 5개 제품을 가져옵니다
                ]);
                setCategories(categoriesResponse.data);
                setFeaturedProducts(productsResponse.data.content);

                // 각 제품의 이미지를 가져옵니다
                const imagesPromises = productsResponse.data.content.map(product =>
                    getProductImages(product.id)
                );
                const imagesResponses = await Promise.all(imagesPromises);
                const images = {};
                imagesResponses.forEach((response, index) => {
                    const productId = productsResponse.data.content[index].id;
                    images[productId] = response.data[0]?.imageUrl || '/placeholder-image.jpg';
                });
                setProductImages(images);

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

    return (
        <Container fluid className="p-0">
            {/* 메인 캐러셀 */}
            <Carousel fade>
                {featuredProducts.map(product => (
                    <Carousel.Item key={product.id}>
                        <img
                            className="d-block w-100"
                            src={productImages[product.id]}
                            alt={product.name}
                            style={{height: '500px', objectFit: 'cover'}}
                        />
                        <Carousel.Caption>
                            <h3>{product.name}</h3>
                            <p>{product.description.substring(0, 100)}...</p>
                            <Button as={Link} to="/products" variant="primary">제품 보기</Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>

            <Container className="my-5">
                {/* 회사 소개 섹션 */}
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

                {/* 카테고리 리스트 섹션 */}
                <h2 className="text-center mb-4">제품 카테고리</h2>
                <Row className="mb-5">
                    {categories.map(category => (
                        <Col md={4} key={category.id} className="mb-3">
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>{category.name}</Card.Title>
                                    <Card.Text>{category.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <div className="text-center mb-5">
                    <Button as={Link} to="/products" variant="primary" size="lg">모든 제품 보기</Button>
                </div>

                {/* CTA 섹션 */}
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