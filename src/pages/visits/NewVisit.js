import React, { useEffect, useState } from "react";
import { addDoc, collection, getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase-config";

function NewVisit({ isAuth, userd }) {
  let navigate = useNavigate();
  const [text, setText] = useState("");
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const visitsCollectionRef = collection(db, "visits");
  const uid = localStorage.getItem("uid");
  const newVisit = async (event) => {
    event.preventDefault();
    await addDoc(visitsCollectionRef, {
      user_id: auth.currentUser.uid || uid,
      reason: text,
      date: date,
      final: false,
      time1: time1,
      time2: time2,
      created_at: Date.now(),
      findate: null,
      verdict: false,
      verdict_id: null,
    }).catch(function (error) {
      alert(error);
    });
    navigate("/");
  };
  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    } else if (isAuth) {
      if (userd === false) {
        navigate("/user_data");
      } else if (userd) {
        getDoc(doc(db, "users", uid)).then((docSnap) => {
          if (!docSnap.exists()) {
            navigate("/user_data");
          } else if (docSnap.data().role !== 1) {
            navigate(-1);
          }
        });
      }
    }
  }, [auth, userd, isAuth]);
  return (
    <div className="container">
      {error && (
        <div className="alert alert-danger" role="alert" id="error">
          {error}
        </div>
      )}
      <form onSubmit={newVisit} name="newVisit_form">
        <div className="mb-3">
          <h1 className="display-6">Reason</h1>
          <textarea
            className="form-control"
            id="textcontrol"
            rows="2"
            value={text}
            required
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="row">
          <h1 className="display-6">Availability</h1>
          <div className="col-sm">
            <div className="mb-3">
              <label htmlFor="dateconcontrol" className="form-label">
                Date
              </label>
              <input
                className="form-control"
                type="date"
                id="dateconcontrol"
                value={date}
                required
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <div className="col-sm">
            <div className="mb-3">
              <label htmlFor="timecontrol1" className="form-label">
                From
              </label>
              <input
                className="form-control"
                type="time"
                id="timecontrol1"
                value={time1}
                required
                onChange={(e) => setTime1(e.target.value)}
              />
            </div>
          </div>
          <div className="col-sm">
            <div className="mb-3">
              <label htmlFor="time2concontrol" className="form-label">
                To
              </label>
              <input
                className="form-control"
                type="time"
                id="time2concontrol"
                value={time2}
                required
                onChange={(e) => setTime2(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          New visit
        </button>
      </form>
    </div>
  );
}

export default NewVisit;
