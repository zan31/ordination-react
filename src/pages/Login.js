import React from "react";
import { useState } from "react";
import { auth, provider } from "../firebase-config";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../UserModel";
import who from "../who.png";

function Login({ setIsAuth }) {
  let navigate = useNavigate();
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      sessionStorage.setItem("isAuth", true);
      const current_user = UserModel(
        result.user.uid,
        result.user.email,
        result.user.emailVerified
      );
      sessionStorage.setItem("user", JSON.stringify(current_user));
      setIsAuth(true);
      navigate("/");
    });
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const SignUserIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        if (!auth.currentUser.emailVerified) {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              navigate("/verify-email");
            })
            .catch((err) => alert(err.message));
        } else {
          sessionStorage.setItem("isAuth", true);
          const current_user = UserModel(
            result.user.uid,
            result.user.email,
            result.user.displayName,
            result.user.emailVerified
          );
          setIsAuth(true);
          sessionStorage.setItem("user", JSON.stringify(current_user));
          navigate("/");
        }
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
