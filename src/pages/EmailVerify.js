import { useEffect } from "react";
import { auth } from "../firebase-config";
import { sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function EmailVerify() {
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
    const btn = document.getElementById("myBtn");
    sendEmailVerification(auth.currentUser)
      .then(() => {
        btn.disabled = true;
        setTimeout(() => {
          btn.disabled = false;
        }, 60000);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="container">
      <div className="EmailVerify">
        <h1 className="display-6">Verify your Email Address</h1>
        <p>
          <strong>A Verification email has been sent to:</strong>
          <br />
          <span>{auth.currentUser?.email}</span>
        </p>
        <span>Follow the instruction in the email to verify your account</span>
        <button
          className="btn btn-dark"
          onClick={resendEmailVerification}
          id="myBtn"
        >
          Resend Email
        </button>
      </div>
    </div>
  );
}

export default EmailVerify;
