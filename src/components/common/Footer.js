import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaPhone, FaMobileAlt, FaFax, FaEnvelope, FaGlobe } from 'react-icons/fa';

function Footer() {
    return (
        <footer className="bg-light py-5 mt-4 border-top">
            <Container>
                <Row>
                    <Col md={6}>
                        <h5 className="font-weight-bold">㈜ 대신기술개발</h5>
                        <ul className="list-unstyled">
                            <li>
                                <FaPhone className="me-2" />
                                T. <a href="tel:0426219032" className="text-dark">042 621 9032</a>
                            </li>
                            <li>
                                <FaMobileAlt className="me-2" />
                                H. <a href="tel:01024889032" className="text-dark">010 2488 9032</a>
                            </li>
                            <li>
                                <FaFax className="me-2" />
                                F. <a href="tel:05040959032" className="text-dark">0504 095 9032</a>
                            </li>
                        </ul>
                    </Col>
                    <Col md={6}>
                        <ul className="list-unstyled">
                            <li>
                                <FaGlobe className="me-2" />
                                <a href="https://www.daeshinpanel.com" target="_blank" rel="noopener noreferrer" className="text-dark">
                                    www.daeshinpanel.com
                                </a>
                            </li>
                            <li>
                                <FaEnvelope className="me-2" />
                                <a href="mailto:daeshinpanel@gmail.com" className="text-dark">daeshinpanel@gmail.com</a>
                            </li>
                            <li>
                                <FaEnvelope className="me-2" />
                                <a href="mailto:k24889032@gmail.com" className="text-dark">k24889032@gmail.com</a>
                            </li>
                        </ul>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col className="text-center">
                        <p className="text-muted">&copy; 2024 대신기술개발. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
