import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-primary text-light py-5 mt-auto">
            <Container>
                <Row className="gy-5">
                    
                    <Col xs={12} md={4} className="text-center text-md-start">
                        <h5 className="text-light fw-bold mb-2">Davis House Sports</h5>
                        <p className="small text-info mb-0">
                            Bet Local.
                        </p>
                    </Col>

                    <Col xs={12} sm={6} md={4} className="text-center">
                        <h6 className="text-uppercase fw-bold mb-3 small opacity-75">Quick Links</h6>
                        <ul className="list-unstyled mb-0">
                            <li className="mb-2">
                                <Link to="/home" className="text-light text-decoration-none py-2 d-block">Home</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/login" className="text-light text-decoration-none py-2 d-block">Login</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/register" className="text-light text-decoration-none py-2 d-block">Register</Link>
                            </li>
                        </ul>
                    </Col>

                    {/* Contact/Social Section */}
                    <Col xs={12} sm={6} md={4} className="text-center text-md-end">
                        <h6 className="text-uppercase fw-bold mb-3 small opacity-75">Support</h6>
                        <ul className="list-unstyled mb-0">
                            <li className="mb-2 py-2 small">Contact Support</li>
                            <li className="mb-2 py-2 small">Privacy Policy</li>
                        </ul>
                    </Col>
                </Row>

                <hr className="my-5 border-light opacity-25" />

                <Row>
                    <Col className="text-center">
                        <p className="small text-light opacity-50 mb-0">
                            &copy; {year} Davis House Sports. All rights reserved.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}
