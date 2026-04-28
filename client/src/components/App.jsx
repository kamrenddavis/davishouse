import Header from "./Header";
import Footer from "./Footer";
import Landing from "./Landing";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from "../utils/ProtectedRoutes";
import { AuthProvider } from "../contexts/AuthContext";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import UpdateProfile from "./UpdateProfile";
import { Container } from 'react-bootstrap'; // Added Container

export default function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100 bg-light"> 
        <Header />

        <main className="flex-grow-1 py-3 py-md-5">
          <Container fluid="sm">
            <Routes>
              <Route path='/' element={<Landing />}/>
              <Route path='/login' element={<Login />}/>
              <Route path='/register' element={<Register />}/>
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route element={<ProtectedRoutes />}>
                <Route path='/home' element={<Home />}/>
              </Route>
            </Routes>
          </Container>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}
