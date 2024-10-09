import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaPhone, FaEnvelope } from 'react-icons/fa';

function Footer() {
    return (
        <footer className="bg-light py-3 border-top">
            <Container>
                <Row className="align-items-center">
                    <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
                        <span className="text-muted">&copy; 2024 대신기술개발</span>
                    </Col>
                    <Col md={6}>
                        <ul className="list-inline text-center text-md-end mb-0">
                            <li className="list-inline-item me-3">
                                <FaPhone className="me-1" />
                                <a href="tel:0426219032" className="text-muted text-decoration-none">042-621-9032</a>
                            </li>
                            <li className="list-inline-item">
                                <FaEnvelope className="me-1" />
                                <a href="mailto:daeshinpanel@gmail.com" className="text-muted text-decoration-none">daeshinpanel@gmail.com</a>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;