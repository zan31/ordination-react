import {
  getDoc,
  doc,
  where,
  query,
  updateDoc,
  collection,
  onSnapshot,
  limit,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../firebase-config";
import Button from "react-bootstrap/Button";

function Dvisits({ isAuth, uid }) {
  let navigate = useNavigate();
  const [visitsList, setVisitsList] = useState([]);
  const [NvisitsList, setNVisitsList] = useState([]);

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    } else if (isAuth) {
      if (uid == null) {
        getDoc(doc(db, "users", localStorage.getItem("uid"))).then(
          (docSnap) => {
            if (!docSnap.exists()) {
              navigate("/user_data");
            } else if (docSnap.data().role !== 3) {
              navigate("/");
            }
          }
        );
      } else {
        getDoc(doc(db, "users", uid)).then((docSnap) => {
          if (!docSnap.exists()) {
            navigate("/user_data");
          } else if (docSnap.data().role !== 3) {
            navigate("/");
          }
        });
      }
    }
  }, [isAuth, navigate, uid]);

  useEffect(() => {
    if (uid == null) {
      const q = query(
        collection(db, "visits"),
        where("doctor_id", "==", localStorage.getItem("uid")),
        where("verdict", "==", true),
        orderBy("findate", "asc")
      );
      //real time update
      onSnapshot(q, (snapshot) => {
        setVisitsList([]);
        snapshot.docs.forEach((doc) => {
          setVisitsList((prev) => [...prev, { data: doc.data(), id: doc.id }]);
        });
      });
    } else {
      const q = query(
        collection(db, "visits"),
        where("doctor_id", "==", uid),
        where("verdict", "==", true),
        orderBy("findate", "asc")
      );
      //real time update
      onSnapshot(q, (snapshot) => {
        setVisitsList([]);
        snapshot.docs.forEach((doc) => {
          setVisitsList((prev) => [...prev, { data: doc.data(), id: doc.id }]);
        });
      });
    }
  }, []);

  useEffect(() => {
    if (uid == null) {
      const q = query(
        collection(db, "visits"),
        where("doctor_id", "==", localStorage.getItem("uid")),
        where("verdict", "==", false),
        orderBy("findate", "asc")
      );
      //real time update
      onSnapshot(q, (snapshot) => {
        setNVisitsList([]);
        snapshot.docs.forEach((doc) => {
          setNVisitsList((prev) => [...prev, { data: doc.data(), id: doc.id }]);
        });
      });
    } else {
      const q = query(
        collection(db, "visits"),
        where("doctor_id", "==", uid),
        where("verdict", "==", false),
        orderBy("findate", "asc")
      );
      //real time update
      onSnapshot(q, (snapshot) => {
        setNVisitsList([]);
        snapshot.docs.forEach((doc) => {
          setNVisitsList((prev) => [...prev, { data: doc.data(), id: doc.id }]);
        });
      });
    }
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
      <div className="container wrapper">
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
        <h1 className="display-6">Visits without a conclusion</h1>
        {NvisitsList.length === 0 && (
          <div>
            There are currently 0 visits with a conclusion!
            <br />
            Good job
          </div>
        )}
        {searchValue === "all" &&
          NvisitsList.map((visit) => {
            const date = new Date(visit.data.created_at);
            const visit_create = date.toLocaleString();
            return (
              <div
                key={visit.id}
                className="card mb-6"
                style={{ marginTop: "2em" }}
              >
                <div className="card-header bg-transparent">idk</div>
                <div className="card-body">
                  <h5 className="card-title">{visit.data.reason}</h5>
                  <p className="card-text">{visit.data.date}</p>
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
          NvisitsList.filter((visit) => visit.data.user_id === searchValue).map(
            (visit) => {
              const date = new Date(visit.data.created_at);
              const visit_create = date.toLocaleString();
              return (
                <div
                  key={visit.id}
                  className="card mb-6"
                  style={{ marginTop: "2em" }}
                >
                  <div className="card-header bg-transparent">idk</div>
                  <div className="card-body">
                    <h5 className="card-title">{visit.data.reason}</h5>
                    <p className="card-text">{visit.data.date}</p>
                    <Link className="link-primary" to={"/visit/" + visit.id}>
                      Details
                    </Link>
                  </div>
                  <div className="card-footer bg-transparent">
                    Created at {visit_create}
                  </div>
                </div>
              );
            }
          )}
        <div className="row" style={{ marginTop: "2em" }}>
          <h1 className="display-6">Visits with a conclusion</h1>
          {visitsList.length === 0 && (
            <div>There are currently 0 visits with a conclusion!</div>
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
                  <div className="card-header bg-transparent">idk</div>
                  <div className="card-body">
                    <h5 className="card-title">{visit.data.reason}</h5>
                    <p className="card-text">{visit.data.date}</p>
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
                    <div className="card-header bg-transparent">idk</div>
                    <div className="card-body">
                      <h5 className="card-title">{visit.data.reason}</h5>
                      <p className="card-text">{visit.data.date}</p>
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

export default Dvisits;
