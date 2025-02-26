import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Track selected role
  const navigate = useNavigate();

  // ✅ Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!role) {
      alert("Please select User or Admin before registering!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/auth/register", { 
        name, 
        email, 
        password, 
        role 
      });

      alert(response.data.message); // Success message

      // ✅ Redirect based on Role
      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
      
    } catch (error) {
      console.error("❌ Registration Error:", error);
      alert(error.response?.data?.detail || "Registration failed!");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="p-4 shadow-lg border-0">
            <h3 className="text-center mb-4">Register</h3>
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              {/* ✅ Role Selection */}
              <Form.Group className="mb-3">
                <Form.Label>Select Role</Form.Label>
                <Form.Select value={role} onChange={(e) => setRole(e.target.value)} required>
                  <option value="">Choose Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">Register</Button>
            </Form>

            {/* Login Redirect */}
            <div className="text-center mt-3">
              <p>Already have an account?</p>
              <Button variant="success" className="w-100" onClick={() => navigate("/login")}>
                Login
              </Button>
            </div>

          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
