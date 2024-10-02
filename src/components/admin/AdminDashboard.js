import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AdminDashboard() {
    return (
        <Container>
            <h1 className="my-4">관리자 대시보드</h1>
            <Row>
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>카테고리 관리</Card.Title>
                            <Card.Text>
                                제품 카테고리를 추가, 수정, 삭제합니다.
                            </Card.Text>
                            <Link to="/admin/categories" className="btn btn-primary">관리하기</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>제품 관리</Card.Title>
                            <Card.Text>
                                제품을 추가, 수정, 삭제합니다.
                            </Card.Text>
                            <Link to="/admin/products" className="btn btn-primary">관리하기</Link>
                        </Card.Body>
                    </Card>
                </Col>
                {/* 필요한 만큼 추가 관리 기능 카드를 여기에 추가 */}
            </Row>
        </Container>
    );
}

export default AdminDashboard;