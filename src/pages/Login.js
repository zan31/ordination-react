import React from "react";
import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login({ setIsAuth }) {
  let navigate = useNavigate();
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      sessionStorage.setItem("isAuth", true);
      sessionStorage.setItem("user", result);
      console.log(result);
      setIsAuth(true);
      navigate("/");
    });
  };
  return (
    <div className="container">
      <button className="btn btn-dark" onClick={signInWithGoogle}>
        Login with google
      </button>
    </div>
  );
}

export default Login;
