import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const navigate = useNavigate(); // ✅ Hook for redirection

  const handleLogout = () => {
    // ✅ Clear authentication data (if using local storage)
    localStorage.removeItem("token"); // Remove token if used

    // ✅ Redirect to login page
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Quiz App</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              {/* ✅ Logout button triggers handleLogout function */}
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
