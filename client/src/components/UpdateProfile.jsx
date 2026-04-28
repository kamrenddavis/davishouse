import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import * as constClass from "../utils/Constants";

export default function UpdateProfile() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${constClass.SERVER_API_URL}/api/update-profile`, 
        { username }, 
        { withCredentials: true }
      );
      setUser(response.data);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
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
                {/* Visual cue: a "step" or "user" icon feel */}
                <div 
                  className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" 
                  style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
                >
                  <i className="bi bi-person-badge">!</i>
                </div>
                <h2 className="fw-bold">One last step!</h2>
                <p className="text-muted small">
                  Choose a unique username to finish setting up your account.
                </p>
              </div>

              {error && (
                <Alert variant="danger" className="py-2 small border-0 mb-4 text-center">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="updateUsername">
                  <Form.Label className="small fw-semibold">Username</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="e.g. SportsFan99" 
                    size="lg"
                    className="bg-light border-0"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted x-small">
                    This is how other players will see you.
                  </Form.Text>
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" 
                    className="py-3 fw-bold shadow-sm"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Finish Setup"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <p className="text-center mt-4 text-white-50 x-small px-4">
            You can always change your display name later in your profile settings.
          </p>
        </Col>
      </Row>
    </Container>
  );
}
