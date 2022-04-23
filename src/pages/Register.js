import React from "react";
import { auth } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import who from "../who.png";
import { Link, useNavigate } from "react-router-dom";
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
              signOut(auth);
              navigate("/login?verify");
            })
            .catch((err) => setError(err.message));
        })
        .catch((err) => setError(err.message));
    }
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="container wrapper">
      {error && (
        <div className="alert alert-danger" role="alert" id="error">
          {error}
        </div>
      )}
      <img src={who} alt="Logo" className="img-fluid mx-auto d-block" />
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
          <Link to="/login" className="link-primary">
            Log in
          </Link>
        </p>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
