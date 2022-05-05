import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebase-config";
import "./App.css";
import UserData from "./pages/UserData";
import NewVisit from "./pages/visits/NewVisit";
import Visits from "./pages/visits/Visits";
import VisitDetail from "./pages/visits/VisitDetail";
import YourVisits from "./pages/visits/YourVisits";
import Dvisits from "./pages/doctor/Dvisits";
import NotFoundPage from "./pages/404";
import DvisitDetail from "./pages/doctor/DvisitDetail";
import Dashboard from "./pages/admin/Dashboard";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const [userv, setUserv] = useState(localStorage.getItem("userv"));
  const [userd, setUserd] = useState(localStorage.getItem("userd"));
  const [uid, setUid] = useState(localStorage.getItem("uid"));
  const [role, setRole] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      const uid = user.uid;
      getDoc(doc(db, "users", uid)).then((docSnap) => {
        if (!docSnap.exists()) {
          localStorage.setItem("userd", false);
          setRole(false);
          setUserd(false);
        } else if (docSnap.exists()) {
          localStorage.setItem("userd", true);
          setRole(docSnap.data().role);
          setUserd(true);
        }
      });
      setCurrentUser(user);
      setUserv(user.emailVerified);
      localStorage.setItem("userv", user.emailVerified);
    });
  }, [userd]);
  const signUserOut = () => {
    signOut(auth).then(() => {
      setUserv(null);
      setUserd(null);
      setIsAuth(false);
      localStorage.clear();
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
              {role === 1 && (
                <li className="nav-item">
                  <Link className="nav-link" to="/new_visit">
                    New visit
                  </Link>
                </li>
              )}
              {role === 1 && (
                <li className="nav-item">
                  <Link className="nav-link" to="/visits">
                    Your visits
                  </Link>
                </li>
              )}
              {userd === false && userv === true && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/user_data">
                      Set your data
                    </Link>
                  </li>
                </>
              )}
              {role === 2 && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/visits">
                      Visits
                    </Link>
                  </li>
                </>
              )}
              {role === 3 && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/visits">
                      Visits
                    </Link>
                  </li>
                </>
              )}

              {role === 5 && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">
                      Admin panel
                    </Link>
                  </li>
                </>
              )}
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
                    onClick={() => signUserOut()}
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
        {currentUser && <Route path="/" element={<Home />} />}

        {role === 1 && (
          <Route
            path="/new_visit"
            element={<NewVisit isAuth={isAuth} userv={userv} userd={userd} />}
          />
        )}
        {userv === true && userd === false && (
          <Route
            path="/user_data"
            element={
              <UserData
                isAuth={isAuth}
                userv={userv}
                userd={userd}
                setUserd={setUserd}
              />
            }
          />
        )}
        {!isAuth && (
          <Route
            path="/login"
            element={
              <Login
                setIsAuth={setIsAuth}
                setUserv={setUserv}
                setUserd={setUserd}
              />
            }
          />
        )}
        {!isAuth && (
          <Route
            path="/register"
            element={<Register setIsAuth={setIsAuth} setUserv={setUserv} />}
          />
        )}
        {role === 2 && (
          <Route
            path="/visit/:id"
            element={<VisitDetail isAuth={isAuth} uid={uid} />}
          />
        )}
        {role === 2 && (
          <Route
            path="/visits"
            element={<Visits isAuth={isAuth} uid={uid} />}
          />
        )}
        {role === 1 && (
          <Route
            path="/visits"
            element={<YourVisits isAuth={isAuth} userd={userd} uid={uid} />}
          />
        )}
        {role === 3 && (
          <Route
            path="/visits"
            element={<Dvisits isAuth={isAuth} uid={uid} />}
          />
        )}
        {role === 3 && (
          <Route
            path="/visit/:id"
            element={<DvisitDetail isAuth={isAuth} uid={uid} />}
          />
        )}
        {role === 5 && (
          <Route
            path="/dashboard"
            element={<Dashboard isAuth={isAuth} uid={uid} />}
          />
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
