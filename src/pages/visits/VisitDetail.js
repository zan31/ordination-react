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
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase-config";

function VisitDetail({ isAuth, uid }) {
  let navigate = useNavigate();
  const [date, setDate] = useState("");
  const [visitsList, setVisitsList] = useState([]);
  useEffect(() => {
    const q = query(
      collection(db, "visits"),
      where("final", "==", true),
      orderBy("findate", "desc"),
      limit(5)
    );
    //real time update
    onSnapshot(q, (snapshot) => {
      setVisitsList([]);
      snapshot.docs.forEach((doc) => {
        setVisitsList((prev) => [...prev, { data: doc.data(), id: doc.id }]);
      });
    });
  }, []);

  const [visit, setVisit] = useState(null);
  let { id } = useParams();
  const updateVisit = async (event) => {
    event.preventDefault();
    const docRef = doc(db, "visits", id);
    await updateDoc(docRef, {
      final: true,
      findate: date,
    });
    navigate("/visits");
  };
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
    getDoc(doc(db, "visits", id)).then((docSnap) => {
      if (docSnap.exists()) {
        setVisit({ data: docSnap.data(), id: docSnap.id });
      } else if (!docSnap.exists()) {
        navigate("/visits");
      }
    });
  }, []);

  const date_to = new Date(visit?.data.created_at);
  const visit_create = date_to.toLocaleString();
  const da = Date.now();
  const da1 = new Date(da);
  const da2 = da1.toLocaleString().split(",");
  var newdate = da2[0].split("/").reverse().join("-");
  var d = new Date();
  const minutes = d.getMinutes();
  const hour = d.getHours();

  const deleteVisit = async (id) => {
    const postDoc = doc(db, "visits", id);
    await deleteDoc(postDoc).catch(function (error) {
      alert(error);
    });
    navigate("/visits");
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
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="card bg" style={{ marginTop: "2em" }}>
              <div className="card-header bg-transparent">
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  data-bs-uid={visit?.id}
                >
                  Delete
                </button>
              </div>
              <div className="card-body">
                <h5 className="card-title" style={{ fontSize: "1.5em" }}>
                  {visit?.data.reason}
                </h5>
                <p className="card-text" style={{ fontSize: "1.3em" }}>
                  {visit?.data.date}
                  <br />
                  Available on {visit?.data.date} between {visit?.data.time1}{" "}
                  and {visit?.data.time2}
                </p>
              </div>
              <div className="card-footer bg-transparent">
                Created at {visit_create}
              </div>
            </div>
          </div>
        </div>
        <span style={{ padding: "2em" }} />
        <div className="row">
          <div className="col-sm">
            <h1 className="display-6">Last visits</h1>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {visitsList.map((visit) => {
                    const datefin = visit.data.findate.split("T");
                    if (visit.id === id) {
                      return (
                        <tr key={visit.id} className="table-active">
                          <td>{datefin[0]}</td>
                          <td>{datefin[1]}</td>
                        </tr>
                      );
                    } else {
                      return (
                        <tr key={visit.id}>
                          <td>{datefin[0]}</td>
                          <td>{datefin[1]}</td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-sm">
            <form onSubmit={updateVisit} name="updateVisit_form">
              {!visit?.data.final && (
                <h1 className="display-6">Update the appointment</h1>
              )}
              {visit?.data.final && (
                <h1 className="display-6">
                  Warning this will overwrite the current appointment time!
                </h1>
              )}

              <div className="mb-3">
                <label htmlFor="dateconcontrol" className="form-label">
                  Date
                </label>
                <input
                  className="form-control"
                  type="datetime-local"
                  min={newdate + "T" + hour + ":" + minutes}
                  id="dateconcontrol"
                  value={date}
                  required
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Set
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default VisitDetail;
