import { collection, onSnapshot, getDoc, doc } from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase-config";

function Visits({ isAuth, uid }) {
  const [visitsList, setVisitsList] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    } else if (isAuth) {
      getDoc(doc(db, "users", uid)).then((docSnap) => {
        if (docSnap.data().role !== 2) {
          navigate("/");
        }
      });
    }
  }, []);

  useEffect(() => {
    const colRef = collection(db, "visits");
    //real time update
    onSnapshot(colRef, (snapshot) => {
      setVisitsList([]);
      snapshot.docs.forEach((doc) => {
        setVisitsList((prev) => [...prev, doc.data()]);
      });
    });
  }, []);
  return (
    <div className="container" style={{ marginTop: "2em" }}>
      {visitsList.map((visit, index) => {
        const date = new Date(visit.created_at);
        const visit_create = date.toLocaleString();
        return (
          <div className="card mb-6" style={{ marginTop: "2em" }}>
            <div className="card-header bg-transparent">Header</div>
            <div className="card-body">
              <h5 className="card-title">{visit.reason}</h5>
              <p className="card-text"> {visit.date} </p>
            </div>
            <div className="card-footer bg-transparent">{visit_create}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Visits;
