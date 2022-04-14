import React from "react";
import { useState, useEffect } from "react";
import { auth, db, provider } from "../firebase-config";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import who from "../who.png";
import { getDoc, doc } from "firebase/firestore";

function Login({ setIsAuth, setUserv, setUserd }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser != null) {
      navigate(-1);
    }
  });

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true);
      setIsAuth(true);
      localStorage.setItem("uid", result.user.uid);
      localStorage.setItem("emailv", result.user.emailVerified);
      setUserv(result.user.emailVerified);
      navigate("/");
    });
  };

  const SignUserIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        localStorage.setItem("isAuth", true);
        setIsAuth(true);
        localStorage.setItem("uid", result.user.uid);
        localStorage.setItem("emailv", result.user.emailVerified);
        setUserv(result.user.emailVerified);
        getDoc(doc(db, "users", result.user.uid)).then((docSnap) => {
          if (docSnap.exists()) {
            localStorage.setItem("userd", true);
            setUserd(true);
            navigate("/");
          } else {
            localStorage.setItem("userd", false);
            setUserd(false);
            navigate("/");
          }
        });
      })
      .catch((err) => setError(err.message));
  };
  return (
    <div className="container wrapper">
      {error && (
        <div className="alert alert-danger" role="alert" id="error">
          {error}
        </div>
      )}
      <img src={who} alt="Logo" className="img-fluid mx-auto d-block" />
      <form onSubmit={SignUserIn} name="login_form">
        <div className="mb-3">
          <label htmlFor="emailcontrol" className="form-label">
            Email address
          </label>
          <input
            className="form-control"
            id="emailcontrol"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="passcontrol" className="form-label">
            Password
          </label>
          <input
            className="form-control"
            type="password"
            id="passcontrol"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <p>
          Don't have an account?&nbsp;
          <a href="/register" className="link-primary">
            Create one here!
          </a>
        </p>
      </form>
      <button className="btn btn-dark" onClick={signInWithGoogle}>
        <i className="bi bi-google"></i> Login with google
      </button>
    </div>
  );
}

export default Login;
