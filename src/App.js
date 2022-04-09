import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Post from "./pages/CreatePost";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerify from "./pages/EmailVerify";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import "./App.css";

function App() {
  const [isAuth, setIsAuth] = useState(sessionStorage.getItem("isAuth"));
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  const SignUserOut = () => {
    signOut(auth).then(() => {
      sessionStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/login";
    });
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Ordination
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/createpost">
                  Create post
                </Link>
              </li>
              {!isAuth ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              ) : (
                <li className="nav-item">
                  <span
                    id="logout-span"
                    className="nav-link"
                    onClick={SignUserOut}
                  >
                    Logout
                  </span>
                </li>
              )}
              {!isAuth && (
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/createpost" element={<Post />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/register" element={<Register setIsAuth={setIsAuth} />} />
        <Route path="/verify-email" element={<EmailVerify />} />
      </Routes>
    </Router>
  );
}

export default App;
