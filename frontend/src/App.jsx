import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import QuizPage from "./pages/QuizPage";
import QuizAttempt from "./pages/QuizAttempt.jsx";

function App() {
  // Get the user from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const userRole = user?.role || null;

  return (
    <Router>
      {userRole && <Navbar />}  {/* Show Navbar only when logged in */}      
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to={userRole === "admin" ? "/dashboard" : "/home"} replace />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to={userRole === "admin" ? "/dashboard" : "/home"} replace />} 
        />

        {/* Admin Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* User Protected Routes */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/quizzes" 
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <QuizAttempt />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/quiz/:quizId" 
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <QuizPage />
            </ProtectedRoute>
          } 
        />

        {/* Default Redirection Based on Role */}
        <Route 
          path="/" 
          element={
            user 
              ? (userRole === "admin" ? <Navigate to="/dashboard" replace /> : <Navigate to="/home" replace />) 
              : <Navigate to="/login" replace />
          } 
        />

        {/* Catch-All Route for 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
