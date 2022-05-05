import {
  collection,
  onSnapshot,
  getDoc,
  doc,
  where,
  orderBy,
  query,
} from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../firebase-config";
import Button from "react-bootstrap/Button";

function Visits({ isAuth, uid }) {
  const [visitsList, setVisitsList] = useState([]);
  const [fvisitsList, setFvisitsList] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    } else if (isAuth) {
      if (uid == null) {
        getDoc(doc(db, "users", localStorage.getItem("uid"))).then(
          (docSnap) => {
            if (!docSnap.exists()) {
              navigate("/user_data");
            } else if (docSnap.data().role !== 2) {
              navigate("/");
            }
          }
        );
      } else {
        getDoc(doc(db, "users", uid)).then((docSnap) => {
          if (!docSnap.exists()) {
            navigate("/user_data");
          } else if (docSnap.data().role !== 2) {
            navigate("/");
          }
        });
      }
    }
  }, [isAuth, navigate, uid]);

  useEffect(() => {
    const q = query(
      collection(db, "visits"),
      where("final", "==", false),
      orderBy("created_at", "asc")
    );
    //real time update
    onSnapshot(q, (snapshot) => {
      setVisitsList([]);
      snapshot.docs.forEach((doc) => {
        setVisitsList((prev) => [...prev, { data: doc.data(), id: doc.id }]);
      });
    });
  }, []);
  useEffect(() => {
    const q = query(
      collection(db, "visits"),
      where("final", "==", true),
      orderBy("findate", "desc")
    );
    //real time update
    onSnapshot(q, (snapshot) => {
      setFvisitsList([]);
      snapshot.docs.forEach((doc) => {
        setFvisitsList((prev) => [...prev, { data: doc.data(), id: doc.id }]);
      });
    });
  }, []);
  const [searchValue, setSearchValue] = useState("all");
  const [patientsList, setPatientsList] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", 1));
    //real time update
    onSnapshot(q, (snapshot) => {
      setPatientsList([]);
      snapshot.docs.forEach((doc) => {
        setPatientsList((prev) => [...prev, { data: doc.data(), id: doc.id }]);
      });
    });
  }, []);
  return (
    <>
      <div className="container" style={{ marginTop: "2em" }}>
        <div className="mb-3">
          <label htmlFor="patient-select" className="form-label">
            Select a patient
          </label>
          <select
            onChange={(event) => setSearchValue(event.target.value)}
            className="form-select"
            aria-label="patients select"
            id="patient-select"
          >
            <option selected value="all">
              All patients
            </option>
            {patientsList?.map((d) => {
              return (
                <option key={d.id} value={d.id}>
                  {d.data.surname + " " + d.data.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="row">
          <h1 className="display-6">Unhandled visits</h1>
          {visitsList.length === 0 && (
            <div>
              There are currently 0 unhandled visits!
              <br />
              Good job
            </div>
          )}
          {searchValue === "all" &&
            visitsList.map((visit) => {
              const date = new Date(visit.data.created_at);
              const visit_create = date.toLocaleString();
              return (
                <div
                  key={visit.id}
                  className="card mb-6"
                  style={{ marginTop: "2em" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">{visit.data.reason}</h5>
                    <p className="card-text">
                      {visit.data.date.split("-").reverse().join("/")}
                    </p>
                    <Link className="link-primary" to={"/visit/" + visit.id}>
                      Details
                    </Link>
                  </div>
                  <div className="card-footer bg-transparent">
                    Created at {visit_create}
                  </div>
                </div>
              );
            })}
          {searchValue !== "all" &&
            visitsList
              .filter((visit) => visit.data.user_id === searchValue)
              .map((visit) => {
                const date = new Date(visit.data.created_at);
                const visit_create = date.toLocaleString();
                return (
                  <div
                    key={visit.id}
                    className="card mb-6"
                    style={{ marginTop: "2em" }}
                  >
                    <div className="card-body">
                      <h5 className="card-title">{visit.data.reason}</h5>
                      <p className="card-text">
                        {visit.data.date.split("-").reverse().join("/")}
                      </p>
                      <Link className="link-primary" to={"/visit/" + visit.id}>
                        Details
                      </Link>
                    </div>
                    <div className="card-footer bg-transparent">
                      Created at {visit_create}
                    </div>
                  </div>
                );
              })}
        </div>
        <div className="row" style={{ marginTop: "2em" }}>
          <h1 className="display-6">Handled visits</h1>
          {fvisitsList.length === 0 && (
            <div>There are currently 0 handled visits!</div>
          )}
          {searchValue === "all" &&
            fvisitsList.map((visit) => {
              const date = new Date(visit.data.created_at);
              const visit_create = date.toLocaleString();
              const datefin = visit.data.findate.split("T");
              return (
                <div
                  key={visit.id}
                  className="card mb-6"
                  style={{ marginTop: "2em" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">{visit.data.reason}</h5>
                    <p className="card-text">
                      The final date is{" "}
                      {datefin[0].split("-").reverse().join("/") +
                        " " +
                        datefin[1]}
                    </p>
                    <Link className="link-primary" to={"/visit/" + visit.id}>
                      Details
                    </Link>
                  </div>
                  <div className="card-footer bg-transparent">
                    Created at {visit_create}
                  </div>
                </div>
              );
            })}
          {searchValue !== "all" &&
            fvisitsList
              .filter((visit) => visit.data.user_id === searchValue)
              .map((visit) => {
                const date = new Date(visit.data.created_at);
                const visit_create = date.toLocaleString();
                const datefin = visit.data.findate.split("T");
                return (
                  <div
                    key={visit.id}
                    className="card mb-6"
                    style={{ marginTop: "2em" }}
                  >
                    <div className="card-body">
                      <h5 className="card-title">{visit.data.reason}</h5>
                      <p className="card-text">
                        The final date is{" "}
                        {datefin[0].split("-").reverse().join("/") +
                          " " +
                          datefin[1]}
                      </p>
                      <Link className="link-primary" to={"/visit/" + visit.id}>
                        Details
                      </Link>
                    </div>
                    <div className="card-footer bg-transparent">
                      Created at {visit_create}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </>
  );
}

export default Visits;
