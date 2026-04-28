import { useState } from 'react';
import { Form, Button, Container, Card, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import * as constClass from "../utils/Constants";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Added loading state for better UX

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${constClass.SERVER_API_URL}/api/forgot-password`, { email });
            setMessage(res.data.message);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
            setMessage("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-4 py-md-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={8} lg={5} xl={4}>
                    <Card className="shadow-sm border-0 rounded-3">
                        <Card.Body className="p-4 p-sm-5">
                            <div className="text-center mb-4">
                                <h3 className="fw-bold">Reset Password</h3>
                                <p className="text-muted small">
                                    Enter your email and we'll send you a link to get back into your account.
                                </p>
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4" controlId="forgotPasswordEmail">
                                    <Form.Label className="small fw-semibold">Email Address</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="name@example.com" 
                                        size="lg" // Larger input is easier to tap on mobile
                                        className="bg-light border-0"
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required 
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        size="lg" 
                                        disabled={loading}
                                        className="py-3 fw-bold"
                                    >
                                        {loading ? "Sending..." : "Send Reset Link"}
                                    </Button>
                                </div>
                            </Form>

                            <div className="mt-4">
                                {message && (
                                    <Alert variant="success" className="small border-0 shadow-sm">
                                        {message}
                                    </Alert>
                                )}
                                {error && (
                                    <Alert variant="danger" className="small border-0 shadow-sm">
                                        {error}
                                    </Alert>
                                )}
                            </div>
                            
                            <div className="text-center mt-4">
                                <a href="/login" className="text-decoration-none small fw-medium">
                                    Back to Login
                                </a>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}