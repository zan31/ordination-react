import {
  collection,
  onSnapshot,
  getDoc,
  doc,
  where,
  orderBy,
  query,
  deleteDoc,
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

  const deleteVisit = async (id) => {
    const postDoc = doc(db, "visits", id);
    await deleteDoc(postDoc).catch(function (error) {
      alert(error);
    });
  };

  useEffect(() => {
    const q = query(
      collection(db, "visits"),
      where("final", "==", false),
      orderBy("created_at", "desc")
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
  var deleteModal = document.getElementById("deleteModal");
  if (deleteModal) {
    deleteModal.addEventListener("show.bs.modal", function (event) {
      var button = event.relatedTarget;

      var recipient = button.getAttribute("data-bs-uid");

      var modalBody = deleteModal.querySelector(".modal-body");
      var button = document.getElementById("deleteButton");

      modalBody.textContent =
        "Are you sure you want to delete visit with id " + recipient + "?";
      button.onclick = function () {
        deleteVisit(recipient);
        document.getElementById("closebtn").click();
      };
    });
  }

  return (
    <>
      <div
        className="modal fade"
        id="deleteModal"
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">
                Alert!
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body"></div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                id="closebtn"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                id="deleteButton"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container" style={{ marginTop: "2em" }}>
        <div className="row">
          <h1 className="display-6">Unhandled visits</h1>

          {visitsList.map((visit) => {
            const date = new Date(visit.data.created_at);
            const visit_create = date.toLocaleString();
            return (
              <div
                key={visit.id}
                className="card mb-6"
                style={{ marginTop: "2em" }}
              >
                <div className="card-header bg-transparent">
                  <Button
                    variant="outline-danger"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteModal"
                    data-bs-uid={visit.id}
                  >
                    Delete
                  </Button>
                </div>
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
        <div className="row" style={{ marginTop: "2em" }}>
          <h1 className="display-6">Handled visits</h1>
          {fvisitsList.map((visit) => {
            const date = new Date(visit.data.created_at);
            const visit_create = date.toLocaleString();
            const datefin = visit.data.findate.split("T");
            return (
              <div
                key={visit.id}
                className="card mb-6"
                style={{ marginTop: "2em" }}
              >
                <div className="card-header bg-transparent">
                  <Button
                    variant="outline-danger"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteModal"
                    data-bs-uid={visit.id}
                  >
                    Delete
                  </Button>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{visit.data.reason}</h5>
                  <p className="card-text">
                    The final date is {datefin[0] + " " + datefin[1]}
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
