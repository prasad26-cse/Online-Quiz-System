// // import { useState, useEffect } from "react";
// // import { Container, Row, Col, Card, Button, Dropdown, Alert } from "react-bootstrap";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";

// // const Home = () => {
// //   const navigate = useNavigate();
// //   const [user, setUser] = useState({ name: "John Doe", role: "user" });
// //   const [quizzes, setQuizzes] = useState([]); // ✅ Always initialize as an array
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const token = localStorage.getItem("token");

// //     axios.get("http://localhost:8000/quizzes/", {
// //         headers: { Authorization: `Bearer ${token}` }  // ✅ Include token
// //     })
// //     .then(response => setQuizzes(response.data.quizzes || []))
// //     .catch(error => {
// //         console.error("❌ Error fetching quizzes:", error);
// //         setError("Failed to load quizzes. Please try again later.");
// //     });
// // }, []);


// //   // ✅ Logout Function
// //   const handleLogout = () => {
// //     // Perform logout operations (e.g., clearing local storage or authentication state)
// //     navigate("/login"); // Redirect to login page
// //   };

// //   return (
// //     <Container fluid className="p-4">
// //       <Row className="align-items-center mb-3">
// //         <Col>
// //           <h2>Welcome, {user.name}</h2>
// //         </Col>
// //         <Col className="text-end">
// //           <Dropdown>
// //             <Dropdown.Toggle variant="primary" id="profile-dropdown">
// //               {user.name[0].toUpperCase()}
// //             </Dropdown.Toggle>
// //             <Dropdown.Menu>
// //               <Dropdown.Item onClick={() => navigate("/profile")}>Personal Info</Dropdown.Item>
// //               <Dropdown.Item onClick={() => navigate("/quizzes")}>Attempted Quizzes</Dropdown.Item>
// //               <Dropdown.Divider />
// //               <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item> {/* ✅ Redirects to login */}
// //             </Dropdown.Menu>
// //           </Dropdown>
// //         </Col>
// //       </Row>

// //       {/* ✅ Show error if quizzes fail to load */}
// //       {error && <Alert variant="danger">{error}</Alert>}

// //       <Row>
// //         {quizzes.length > 0 ? (
// //           quizzes.map((quiz) => (
// //             <Col md={6} lg={4} xl={3} key={quiz.id} className="mb-4">
// //               <Card className="shadow-sm">
// //                 <Card.Body>
// //                   <Card.Title>{quiz.title}</Card.Title>
// //                   <Card.Text>Duration: {quiz.duration} mins</Card.Text>
// //                   <Button variant="primary" onClick={() => navigate(`/quiz/${quiz.id}`)}>Attempt Quiz</Button>
// //                 </Card.Body>
// //               </Card>
// //             </Col>
// //           ))
// //         ) : (
// //           !error && <p className="text-center">No quizzes available.</p>
// //         )}
// //       </Row>
// //     </Container>
// //   );
// // };

// // export default Home;
// import { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Button, Dropdown, Alert } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const Home = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);  // ✅ Initially null (will be fetched)
//   const [quizzes, setQuizzes] = useState([]); 
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");  // ✅ Redirect if no token (not logged in)
//       return;
//     }

//     axios.get("http://localhost:8000/auth/me", {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//     .then(response => {
//       setUser(response.data);
//     })
//     .catch(error => {
//       console.error("❌ Error fetching user:", error.response?.data || error.message);
//       setError("Failed to load user details.");
//     });

//     // ✅ Fetch quizzes
//     axios.get("http://localhost:8000/quizzes/", {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//     .then(response => setQuizzes(response.data.quizzes || []))
//     .catch(error => {
//       console.error("❌ Error fetching quizzes:", error);
//       setError("Failed to load quizzes. Please try again later.");
//     });
//   }, []);

//   // ✅ Logout Function
//   const handleLogout = () => {
//     localStorage.removeItem("token"); 
//     localStorage.removeItem("role"); 
//     localStorage.removeItem("email"); 
//     navigate("/login"); // ✅ Redirect to login
//   };

//   return (
//     <Container fluid className="p-4">
//       <Row className="align-items-center mb-3">
//         <Col>
//           <h2>Welcome, {user ? user.name : "Loading..."}</h2>
//         </Col>
//         <Col className="text-end">
//           <Dropdown>
//             <Dropdown.Toggle variant="primary" id="profile-dropdown">
//               {user ? user.name[0].toUpperCase() : "?"}
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               <Dropdown.Item onClick={() => navigate("/profile")}>Personal Info</Dropdown.Item>
//               <Dropdown.Item onClick={() => navigate("/quizzes")}>Attempted Quizzes</Dropdown.Item>
//               <Dropdown.Divider />
//               <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>
//         </Col>
//       </Row>

//       {/* ✅ Show error if quizzes fail to load */}
//       {error && <Alert variant="danger">{error}</Alert>}

//       <Row>
//         {quizzes.length > 0 ? (
//           quizzes.map((quiz) => (
//             <Col md={6} lg={4} xl={3} key={quiz.id} className="mb-4">
//               <Card className="shadow-sm">
//                 <Card.Body>
//                   <Card.Title>{quiz.title}</Card.Title>
//                   <Card.Text>Duration: {quiz.duration} mins</Card.Text>
//                   <Button variant="primary" onClick={() => navigate(`/quiz/${quiz.id}`)}>Attempt Quiz</Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))
//         ) : (
//           !error && <p className="text-center">No quizzes available.</p>
//         )}
//       </Row>
//     </Container>
//   );
// };

// export default Home;
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Dropdown, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser ] = useState({ name: "", role: "" });
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    let userName = localStorage.getItem("user_name");
    let userRole = localStorage.getItem("user_role");

    console.log("🟢 Local Storage Data BEFORE Fix:", { userName, userRole });

    // Fix issue: If userName is falsy, reset it
    if (!userName) {
      console.warn("⚠️ Fixing user_name from localStorage...");
      userName = "User "; // Set default name
      localStorage.setItem("user_name", userName); // Correct it in localStorage
    }

    if (!token) {
      navigate("/login");  // Redirect if no token
      return;
    }

    setUser ({ name: userName, role: userRole || "user" });

    // Fetch quizzes
    axios.get("http://localhost:8000/quizzes/", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      console.log("✅ Quizzes Fetched:", response.data);
      setQuizzes(response.data.quizzes || []);
    })
    .catch(error => {
      console.error("❌ Error fetching quizzes:", error);
      setError("Failed to load quizzes. Please try again later.");
    })
    .finally(() => {
      setLoading(false); // Set loading to false after fetching
    });

  }, [navigate]);

  // Logout Function
  const handleLogout = () => {
    localStorage.clear();  // Remove all stored data
    navigate("/login");
  };

  return (
    <Container fluid className="p-4">
      <Row className="align-items-center mb-3">
        <Col>
          <h2>Welcome, {user.name}</h2>
        </Col>
        <Col className="text-end">
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="profile-dropdown">
              {user.name ? user.name[0].toUpperCase() : "?"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate("/profile")}>Personal Info</Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/quizzes")}>Attempted Quizzes</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? ( // Show loading spinner while fetching
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <Col md={6} lg={4} xl={3} key={quiz.id} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title>{quiz.title}</Card.Title>
                    <Card.Text>Duration: {quiz.duration} mins</Card.Text>
                    <Button variant="primary" onClick={() => navigate(`/quiz/${quiz.id}`)}>Attempt Quiz</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            !error && <p className="text-center">No quizzes available.</p>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Home;