import React from "react";
import { auth } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Register({ setIsAuth, setUserv }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validatePassword = () => {
    let isValid = true;
    if (password !== "" && confirmPassword !== "") {
      if (password !== confirmPassword) {
        isValid = false;
        setError("Passwords does not match");
      }
    }
    return isValid;
  };

  const SignUserIn = (e) => {
    e.preventDefault();
    setError("");
    if (validatePassword()) {
      // Create a new user with email and password using firebase
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              localStorage.setItem("uid", auth.currentUser.uid);
              localStorage.setItem("isAuth", true);
              setIsAuth(true);
              setUserv(false);
              navigate("/verify-email");
            })
            .catch((err) => setError(err.message));
        })
        .catch((err) => setError(err.message));
    }
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="container">
      {error && (
        <div className="alert alert-danger" role="alert" id="error">
          {error}
        </div>
      )}
      <form onSubmit={SignUserIn} name="registration_form">
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
        <div className="mb-3">
          <label htmlFor="passconcontrol" className="form-label">
            Confirm password
          </label>
          <input
            className="form-control"
            type="password"
            id="passconcontrol"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <p>
          Already have an account?&nbsp;
          <a href="/login" className="link-primary">
            Log in
          </a>
        </p>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
