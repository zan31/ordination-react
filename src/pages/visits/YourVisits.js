import "bootstrap-icons/font/bootstrap-icons.css";
import "../../App.css";
import { React, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../../firebase-config";
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
import Button from "react-bootstrap/Button";

function YourVisits({ isAuth, userd, uid }) {
  let navigate = useNavigate();
  const [visitsList, setVisitsList] = useState([]);
  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    } else if (isAuth) {
      if (userd === false) {
        navigate("/user_data");
      }
    }
  }, [auth, userd, isAuth]);
  useEffect(() => {
    if (uid == null) {
      const q = query(
        collection(db, "visits"),
        where("user_id", "==", auth.currentUser.uid)
      ); //real time update
      onSnapshot(q, (snapshot) => {
        setVisitsList([]);
        snapshot.docs.forEach((doc) => {
          setVisitsList((prev) => [...prev, { data: doc.data(), id: doc.id }]);
        });
      });
    } else if (uid) {
      const q = query(collection(db, "visits"), where("user_id", "==", uid)); //real time update
      onSnapshot(q, (snapshot) => {
        setVisitsList([]);
        snapshot.docs.forEach((doc) => {
          setVisitsList((prev) => [...prev, { data: doc.data(), id: doc.id }]);
        });
      });
    }
  }, []);
  const deleteVisit = async (id) => {
    const postDoc = doc(db, "visits", id);
    await deleteDoc(postDoc).catch(function (error) {
      alert(error);
    });
  };
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
      <div className="container wrapper">
        {visitsList.length === 0 && (
          <div>
            You have 0 visits at the moment. If you are feeling ill please
            create a new visit!
            <br />
            <Link to="/new_visit">
              <button type="button" className="btn btn-primary">
                New visit
              </button>
            </Link>
          </div>
        )}
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
              </div>
              <div className="card-footer bg-transparent">
                Created at {visit_create}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default YourVisits;
