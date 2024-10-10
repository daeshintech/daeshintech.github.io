import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
    FaList,
    FaBox,
    FaUsersCog,
    FaChartBar,
    FaTools,
    FaFileAlt,
    FaBuilding,
    FaCheckSquare
} from 'react-icons/fa';

function AdminDashboard() {
    const dashboardItems = [
        {
            title: '견적 요청 및 문의 관리',
            description: '고객의 견적 요청과 문의를 확인하고 처리합니다.',
            link: '/admin/quote-management',
            icon: FaFileAlt
        },
        {
            title: '시공 프로젝트 관리',
            description: '진행 중인 시공 프로젝트를 관리합니다.',
            link: '/admin/installation-projects',
            icon: FaTools
        },
        {
            title: '시공 사례 관리',
            description: '완료된 시공 사례를 관리하고 공개합니다.',
            link: '/admin/installation-cases',
            icon: FaCheckSquare
        },
        {
            title: '제품 관리',
            description: '제품을 추가, 수정, 삭제합니다.',
            link: '/admin/products',
            icon: FaBox
        },
        {
            title: '카테고리 관리',
            description: '제품 카테고리를 추가, 수정, 삭제합니다.',
            link: '/admin/categories',
            icon: FaList
        },
        {
            title: '고객 관리',
            description: '고객 계정과 정보를 관리합니다.',
            link: '/admin/customers',
            icon: FaUsersCog
        },
        {
            title: '통계 및 보고서',
            description: '시공 및 다양한 통계를 확인합니다.',
            link: '/admin/statistics',
            icon: FaChartBar
        },
        {
            title: '회사 정보 관리',
            description: '회사 정보와 정책을 관리합니다.',
            link: '/admin/company-info',
            icon: FaBuilding
        }
    ];

    return (
        <Container fluid className="py-5 bg-light">
            <h1 className="text-center mb-5">관리자 대시보드</h1>
            <Row className="justify-content-center">
                {dashboardItems.map((item, index) => (
                    <Col xs={12} sm={6} md={4} lg={3} key={index} className="mb-4">
                        <Card
                            as={Link}
                            to={item.link}
                            className="h-100 shadow-sm text-decoration-none text-dark hover-shadow transition"
                        >
                            <Card.Body className="d-flex flex-column align-items-center">
                                <item.icon size={48} className="text-primary mb-3" />
                                <Card.Title className="text-center">{item.title}</Card.Title>
                                <Card.Text className="text-center small">{item.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default AdminDashboard;