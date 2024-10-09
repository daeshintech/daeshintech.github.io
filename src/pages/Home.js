import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getRootCategories } from '../services/categoryService';
import { getSortedAndSearchedProducts } from '../services/productService';
import { getProductImages, getImageUrl } from '../services/productImageService';

function Home() {
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const categoriesResponse = await getRootCategories();
                // Reverse the order of categories
                setCategories(categoriesResponse.data.reverse());

                const categoryProductsPromises = categoriesResponse.data.map(category =>
                    getSortedAndSearchedProducts('', category.id, 'updatedAt', 'desc', 1, 5)
                );
                const categoryProductsResponses = await Promise.all(categoryProductsPromises);

                const productsWithImages = {};
                for (let i = 0; i < categoryProductsResponses.length; i++) {
                    const categoryId = categoriesResponse.data[i].id;
                    const products = categoryProductsResponses[i].data.content;
                    const productsWithImagesPromises = products.map(async product => {
                        const imageResponse = await getProductImages(product.id);
                        return {
                            ...product,
                            imageUrl: imageResponse.data[0]?.filename ? getImageUrl(imageResponse.data[0].filename) : null
                        };
                    });
                    productsWithImages[categoryId] = await Promise.all(productsWithImagesPromises);
                }
                setCategoryProducts(productsWithImages);

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

    const handleCategoryClick = (categoryId) => {
        navigate(`/products?category=${categoryId}`);
    };

    return (
        <Container fluid className="p-0">
            <Container className="my-5">
                <Row className="mb-5">
                    <Col>
                        <h1 className="text-primary text-center">대신기술개발에 오신 것을 환영합니다</h1>
                        <p className="lead text-center">
                            대신기술개발은 혁신적인 기술 솔루션을 제공하는 선도적인 기업입니다.
                            우리는 고객의 요구를 충족시키고 미래를 선도하는 제품을 개발하기 위해 끊임없이 노력하고 있습니다.
                        </p>
                    </Col>
                </Row>

                {categories.map(category => (
                    <div key={category.id} className="mb-5">
                        <h2 className="text-center mb-4">{category.name}</h2>
                        <Carousel>
                            {categoryProducts[category.id]?.map(product => (
                                <Carousel.Item key={product.id}>
                                    <img
                                        className="d-block w-100"
                                        src={product.imageUrl || '/path/to/placeholder-image.jpg'}
                                        alt={product.name}
                                        style={{ height: '400px', objectFit: 'cover' }}
                                    />
                                    <Carousel.Caption>
                                        <h3>{product.name}</h3>
                                        <p>{product.description.substring(0, 100)}...</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                        <div className="text-center mt-3">
                            <Button onClick={() => handleCategoryClick(category.id)} variant="outline-primary">
                                {category.name} 전체보기
                            </Button>
                        </div>
                    </div>
                ))}

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