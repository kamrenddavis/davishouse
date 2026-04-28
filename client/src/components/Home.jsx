import { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col } from 'react-bootstrap'; // Added these
import * as constClass from "../utils/Constants";
import { AuthContext } from '../contexts/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  function handleLogout() {
    axios.post(`${constClass.SERVER_API_URL}/api/logout`, {}, { 
      withCredentials: true
    })
    .then(() => {
      setUser(null);
      navigate('/login');
    })
    .catch((error) => {
      console.error('Logout error:', error);
      setUser(null);
      navigate('/login');
    });
  }

  return (
    <Container className="py-4 py-md-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-4 p-sm-5 text-center">
              
              <div 
                className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4 shadow-sm" 
                style={{ width: '80px', height: '80px', fontSize: '2rem' }}
              >
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>

              <h2 className="fw-bold mb-2">
                Welcome, {user?.username || 'User'}!
              </h2>
              
              <p className="text-muted mb-5">
                You are securely logged into your Davis House Sports dashboard.
              </p>

              <div className="d-grid gap-3">
                <Button 
                  variant="outline-primary" 
                  size="lg" 
                  className="py-3 fw-semibold border-2"
                  onClick={() => navigate('/update-profile')}
                >
                  Edit Profile
                </Button>
                
                <Button 
                  variant="danger" 
                  size="lg" 
                  className="py-3 fw-semibold shadow-sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Footer note for the dashboard */}
          <div className="text-center mt-4 text-white-50">
            <small>Session active for davishousesports.com</small>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
