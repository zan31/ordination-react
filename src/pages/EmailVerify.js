import { useState, useEffect } from "react";
import { auth } from "../firebase-config";
import { sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function EmailVerify({ currentUser }) {
  let setTimeActive = false;
  const [time, setTime] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    auth.currentUser
      ?.reload()
      .then(() => {
        if (auth.currentUser?.emailVerified) {
          navigate("/");
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  }, [navigate, auth.currentUser]);

  const resendEmailVerification = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setTimeActive = true;
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="center">
      <div className="EmailVerify">
        <h1>Verify your Email Address</h1>
        <p>
          <strong>A Verification email has been sent to:</strong>
          <br />
          <span>{auth.currentUser?.email}</span>
        </p>
        <span>Follow the instruction in the email to verify your account</span>
        <button onClick={resendEmailVerification}>Resend Email</button>
      </div>
    </div>
  );
}

export default EmailVerify;
