import { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import * as constClass from "../utils/Constants";
import { AuthContext } from '../contexts/AuthContext';
import googleIcon from '../assets/Google_G_logo.svg.webp';

export default function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const { setUser } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: ""
    });

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(""); 
    }

    function handleSubmit(event) {
        event.preventDefault();
        setError("");

        axios.post(`${constClass.SERVER_API_URL}/api/register`, formData, {
            withCredentials: true
        })
        .then((response) => {
            setUser(response.data);
            navigate('/home');
        })
        .catch((err) => {
            const message = err.response?.data?.message || "Registration failed. Email or Username may be taken.";
            setError(message);
        });
    }

    const handleGoogleLogin = () => {
        window.location.href = `https://api.davishousesports.com/auth/google`;
    };

    return (
        <Container className="py-4 py-md-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={6} lg={5} xl={4}>
                    <Card className="shadow border-0 rounded-4">
                        <Card.Body className="p-4 p-sm-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold">Create Account</h2>
                                <p className="text-muted small">Join Davis House Sports today</p>
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className='mb-3' controlId='formEmail'>
                                    <Form.Label className="small fw-semibold">Email Address</Form.Label>
                                    <Form.Control
                                        onChange={handleChange}
                                        value={formData.email}
                                        name="email"
                                        placeholder="your@email.com"
                                        type="email"
                                        size="lg"
                                        className="bg-light border-0"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className='mb-3' controlId='formUsername'>
                                    <Form.Label className="small fw-semibold">Username</Form.Label>
                                    <Form.Control
                                        onChange={handleChange}
                                        value={formData.username}
                                        name="username"
                                        placeholder="Choose a display name"
                                        type="text"
                                        size="lg"
                                        className="bg-light border-0"
                                        required
                                    />
                                </Form.Group>
                                
                                <Form.Group className='mb-4' controlId='formPassword'>
                                    <Form.Label className="small fw-semibold">Password</Form.Label>
                                    <Form.Control
                                        onChange={handleChange}
                                        value={formData.password}
                                        name="password"
                                        placeholder="Create a password"
                                        type="password"
                                        size="lg"
                                        className="bg-light border-0"
                                        required
                                    />
                                </Form.Group>

                                {error && (
                                    <Alert variant="danger" className="py-2 small border-0 mb-4">
                                        {error}
                                    </Alert>
                                )}

                                <Button variant='primary' type="submit" size="lg" className="w-100 py-3 fw-bold shadow-sm">
                                    Register Now
                                </Button>
                            </Form>

                            <div className="text-center mt-4">
                                <p className="small text-muted mb-4">
                                    Already have an account? <Link to="/login" className="fw-bold text-decoration-none">Login here</Link>
                                </p>
                                
                                <div className="d-flex align-items-center mb-4">
                                    <hr className="flex-grow-1 opacity-25" />
                                    <span className="mx-3 text-muted x-small fw-bold">OR</span>
                                    <hr className="flex-grow-1 opacity-25" />
                                </div>

                                <Button 
                                    variant="outline-dark" 
                                    onClick={handleGoogleLogin} 
                                    size="lg"
                                    className="w-100 d-flex align-items-center justify-content-center py-2 border-2"
                                >
                                    <img 
                                        src={googleIcon} 
                                        alt="Google logo" 
                                        style={{ width: '20px', marginRight: '12px' }} 
                                    />
                                    <span className="small fw-semibold">Sign up with Google</span>
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                    
                    <p className="text-center mt-4 text-white-50 x-small">
                        By registering, you confirm you are of legal gambling age.
                    </p>
                </Col>
            </Row>
        </Container>
    );
}
