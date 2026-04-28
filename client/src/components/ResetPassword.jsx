import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import * as constClass from "../utils/Constants";

export default function ResetPassword() {
    const { token } = useParams();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setError("Passwords do not match.");
        }

        setLoading(true);
        setError("");

        try {
            await axios.post(`${constClass.SERVER_API_URL}/api/reset-password`, {
                email, token, newPassword
            });
            // Using a slight delay or navigate immediately for better UX
            navigate('/login', { state: { message: "Password updated successfully! Please login." } });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password. Link may be expired.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-4 py-md-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={6} lg={5} xl={4}>
                    <Card className="shadow border-0 rounded-4">
                        <Card.Body className="p-4 p-sm-5">
                            <div className="text-center mb-4">
                                <h3 className="fw-bold">New Password</h3>
                                <p className="text-muted small">Please enter your new secure password below.</p>
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="newPassword">
                                    <Form.Label className="small fw-semibold">New Password</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Min. 8 characters"
                                        size="lg"
                                        className="bg-light border-0"
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="confirmPassword">
                                    <Form.Label className="small fw-semibold">Confirm New Password</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Repeat your password"
                                        size="lg"
                                        className="bg-light border-0"
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        required 
                                    />
                                </Form.Group>

                                {error && (
                                    <Alert variant="danger" className="py-2 small border-0 mb-3 text-center">
                                        {error}
                                    </Alert>
                                )}

                                <div className="d-grid">
                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        size="lg" 
                                        className="py-3 fw-bold shadow-sm"
                                        disabled={loading}
                                    >
                                        {loading ? "Updating..." : "Update Password"}
                                    </Button>
                                </div>
                            </Form>

                            <div className="text-center mt-4">
                                <Button 
                                    variant="link" 
                                    className="text-decoration-none small text-muted"
                                    onClick={() => navigate('/login')}
                                >
                                    Cancel and return to login
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    <div className="text-center mt-4 text-white-50 x-small px-4">
                        Ensure your password contains a mix of letters, numbers, and symbols for better security.
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
