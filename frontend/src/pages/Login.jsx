// // import { useState } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";

// // const Login = () => {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const navigate = useNavigate();

// //   const handleLogin = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const response = await axios.post("http://localhost:8000/auth/login", { email, password });
// //       localStorage.setItem("token", response.data.token);
// //       alert("Login Successful!");
// //       navigate("/dashboard");
// //     } catch (error) {
// //       alert("Invalid Credentials");
// //     }
// //   };

// //   return (
// //     <div className="container mt-5">
// //       <div className="row justify-content-center">
// //         <div className="col-md-4">
// //           <div className="card p-4 shadow">
// //             <h3 className="text-center mb-4">Login</h3>
// //             <form onSubmit={handleLogin}>
// //               <div className="mb-3">
// //                 <label className="form-label">Email</label>
// //                 <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
// //               </div>
// //               <div className="mb-3">
// //                 <label className="form-label">Password</label>
// //                 <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
// //               </div>
// //               <button type="submit" className="btn btn-primary w-100">Login</button>
// //             </form>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Container, Row, Col, Card, Form, Button, Dropdown } from "react-bootstrap";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState(""); // Track selected role
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!role) {
//       alert("Please select User or Admin before logging in!");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:8000/auth/login", { email, password });
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("role", role);

//       alert("Login Successful!");
      
//       // Redirect based on role selection
//       if (role === "admin") {
//         navigate("/dashboard");
//       } else {
//         navigate("/home");
//       }
//     } catch (error) {
//       alert("Invalid Credentials");
//     }
//   };

//   return (
//     <Container className="mt-5">
//       <Row className="justify-content-center">
//         <Col md={6} lg={4}>
//           <Card className="p-4 shadow-lg border-0">
//             <h3 className="text-center mb-4">Login</h3>
//             <Form onSubmit={handleLogin}>
//               {/* Role Selection Dropdown */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Select Role</Form.Label>
//                 <Dropdown onSelect={(eventKey) => setRole(eventKey)}>
//                   <Dropdown.Toggle variant="secondary" className="w-100">
//                     {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Choose Role"}
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu className="w-100">
//                     <Dropdown.Item eventKey="user">User</Dropdown.Item>
//                     <Dropdown.Item eventKey="admin">Admin</Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   type="email"
//                   placeholder="Enter email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Password</Form.Label>
//                 <Form.Control
//                   type="password"
//                   placeholder="Enter password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </Form.Group>

//               <Button type="submit" variant="primary" className="w-100">Login</Button>
//             </Form>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Login;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//         const response = await axios.post("http://localhost:8000/auth/login", { email, password });
        
//         if (response.data.token) {
//             localStorage.setItem("token", response.data.token);  // ✅ Save token
//             localStorage.setItem("role", response.data.role);    // ✅ Save role

//             // ✅ Redirect based on role
//             if (response.data.role === "admin") {
//                 navigate("/dashboard");
//             } else {
//                 navigate("/home");
//             }
//         }
//     } catch (error) {
//         console.error("❌ Login Failed:", error);
//         alert(error.response?.data?.detail || "Invalid Credentials!");
//     }
// };
const handleLogin = async (e) => {
  e.preventDefault();
  try {
      const response = await axios.post("http://localhost:8000/auth/login", { email, password });

      localStorage.setItem("token", response.data.token);  // ✅ Store token
      localStorage.setItem("user_name", response.data.name);  // ✅ Store user name
      localStorage.setItem("user_role", response.data.role);  // ✅ Store user role

      // ✅ Redirect based on role
      if (response.data.role === "admin") {
          navigate("/dashboard");
      } else {
          navigate("/home");
      }
  } catch (error) {
      console.error("❌ Login Failed:", error.response?.data || error.message);
      alert(error.response?.data?.detail || "Invalid credentials!");
  }
};



  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>

        {error && <Alert variant="danger">{error}</Alert>} {/* ✅ Show error if login fails */}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>

        <div className="text-center mt-3">
          <p>
            Don't have an account?{" "}
            <span
              className="text-primary cursor-pointer"
              onClick={() => navigate("/register")}
              style={{ cursor: "pointer" }}
            >
              Register here
            </span>
          </p>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
