import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();

    return (
        /* Using a subtle gradient background for a more premium "Sports App" feel */
        <div className="min-vh-100 d-flex align-items-center bg-dark text-white" 
             style={{ 
                 background: 'linear-gradient(135deg, #0d6efd 0%, #052c65 100%)',
                 padding: '20px 0' 
             }}>
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                        <div className="text-center mb-5">
                            {/* Responsive font size: display-3 on mobile, display-2 on desktop */}
                            <h1 className="display-3 fw-bold mb-2 text-white">
                                Davis House Sports
                            </h1>
                            <p className="lead fw-light opacity-75">
                                Bet local. Win big.
                            </p>
                        </div>

                        {/* Wrapping actions in a Card adds professional structure on mobile */}
                        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                            <Card.Body className="p-4 p-sm-5 bg-white text-dark">
                                
                                <div className="text-center mb-4">
                                    <h4 className="fw-bold">Welcome</h4>
                                    <p className="text-muted small">Access your sportsbook dashboard</p>
                                </div>

                                <div className="d-grid gap-3">
                                    {/* Login Section */}
                                    <Button 
                                        variant="primary" 
                                        size="lg" 
                                        className="py-3 fw-bold rounded-3 shadow-sm"
                                        onClick={() => navigate('/login')}
                                    >
                                        Login to Account
                                    </Button>

                                    <div className="my-2 d-flex align-items-center">
                                        <hr className="flex-grow-1" />
                                        <span className="mx-3 text-muted small fw-bold">OR</span>
                                        <hr className="flex-grow-1" />
                                    </div>

                                    {/* Register Section */}
                                    <Button 
                                        variant="outline-primary" 
                                        size="lg" 
                                        className="py-3 fw-bold rounded-3"
                                        onClick={() => navigate('/register')}
                                    >
                                        Create New Account
                                    </Button>
                                </div>
                                
                                <p className="text-center mt-4 mb-0 x-small text-muted">
                                    Must be 21+ to play. Please bet responsibly.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
