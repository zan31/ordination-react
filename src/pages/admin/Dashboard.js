import {
  getDoc,
  doc,
  collection,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase-config";
import { send } from "emailjs-com";

function Dashboard({ isAuth, uid }) {
  const [userList, setUserList] = useState([]);
  const [visitList, setVisitList] = useState([]);
  const [verdictList, setVerdictList] = useState([]);
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
            } else if (docSnap.data().role !== 5) {
              navigate("/");
            }
          }
        );
      } else {
        getDoc(doc(db, "users", uid)).then((docSnap) => {
          if (!docSnap.exists()) {
            navigate("/user_data");
          } else if (docSnap.data().role !== 5) {
            navigate("/");
          }
        });
      }
    }
  }, [isAuth, navigate, uid]);
  useEffect(() => {
    const colRef = collection(db, "visits");
    //real time update
    onSnapshot(colRef, (snapshot) => {
      setVisitList([]);
      snapshot.docs.forEach((doc) => {
        setVisitList((prev) => [...prev, { data: doc.data(), id: doc.id }]);
      });
    });
  }, []);

  useEffect(() => {
    const colRef = collection(db, "users");
    //real time update
    onSnapshot(colRef, (snapshot) => {
      setUserList([]);
      snapshot.docs.forEach((doc) => {
        setUserList((prev) => [...prev, { data: doc.data(), id: doc.id }]);
      });
    });
  }, []);
  useEffect(() => {
    const colRef = collection(db, "verdicts");
    //real time update
    onSnapshot(colRef, (snapshot) => {
      setVerdictList([]);
      snapshot.docs.forEach((doc) => {
        setVerdictList((prev) => [...prev, { data: doc.data(), id: doc.id }]);
      });
    });
  }, []);
  const [role, setRole] = useState("");
  const [u_id, setUid] = useState("");
  const updateRole = async (event) => {
    event.preventDefault();
    const docRef = doc(db, "users", u_id);
    if (role === "1") {
      await updateDoc(docRef, {
        role: 1,
      }).then(() => {
        setRole("");
        document.getElementById("closebtn").click();
      });
    }
    if (role === "2") {
      await updateDoc(docRef, {
        role: 2,
      }).then(() => {
        setRole("");
        document.getElementById("closebtn").click();
      });
    }
    if (role === "3") {
      await updateDoc(docRef, {
        role: 3,
      }).then(() => {
        setRole("");
        document.getElementById("closebtn").click();
      });
    }
    if (role === "5") {
      await updateDoc(docRef, {
        role: 5,
      }).then(() => {
        setRole("");
        document.getElementById("closebtn").click();
      });
    }
  };

  var updateModal = document.getElementById("updateModal");
  if (updateModal) {
    updateModal.addEventListener("show.bs.modal", function (event) {
      var button = event.relatedTarget;

      var recipient = button.getAttribute("data-bs-uid");

      setUid(recipient);
      var button1 = document.getElementById("roleButton");
    });
  }

  return (
    <>
      <div
        className="modal fade"
        id="updateModal"
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">
                Change role!
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={updateRole} name="updateVisit_form">
                <div className="mb-3">
                  <label htmlFor="patient-select" className="form-label">
                    Select a role
                  </label>
                  <select
                    onChange={(event) => setRole(event.target.value)}
                    className="form-select"
                    aria-label="role select"
                    id="role-select"
                  >
                    <option selected disabled>
                      Change role
                    </option>
                    <option value="1">Patient</option>
                    <option value="2">Nurse</option>
                    <option value="3">Doctor</option>
                    <option value="5">Admin</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Change
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                id="closebtn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container wrapper">
        <h1 className="display-2">Visits</h1>
        <div className="table-responsive">
          <h1 className="display-6">Fresh visits</h1>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Reason</th>
                <th scope="col">User id</th>
                <th scope="col">Created at</th>
              </tr>
            </thead>
            <tbody>
              {visitList
                .filter((visit) => visit.data.final === false)
                .map((visit) => {
                  const date = new Date(visit.data.created_at);
                  const visit_create = date.toLocaleString();
                  return (
                    <tr key={visit.id}>
                      <td>{visit.data.reason}</td>
                      <td>{visit.data.user_id}</td>
                      <td>{visit_create}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="table-responsive">
          <h1 className="display-6">Final visits</h1>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Reason</th>
                <th scope="col">User id</th>
                <th scope="col">Time of appointment</th>
                <th scope="col">Created at</th>
              </tr>
            </thead>
            <tbody>
              {visitList
                .filter(
                  (visit) =>
                    visit.data.final === true && visit.data.verdict === false
                )
                .map((visit) => {
                  const date = new Date(visit.data.created_at);
                  const visit_create = date.toLocaleString();
                  return (
                    <tr key={visit.id}>
                      <td>{visit.data.reason}</td>
                      <td>{visit.data.user_id}</td>
                      <td>{visit.data.findate}</td>
                      <td>{visit_create}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="table-responsive">
          <h1 className="display-6">Final visits with a conclusion</h1>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Reason</th>
                <th scope="col">User id</th>
                <th scope="col">Time of appointment</th>
                <th scope="col">Verdict id</th>
                <th scope="col">Created at</th>
              </tr>
            </thead>
            <tbody>
              {visitList
                .filter(
                  (visit) =>
                    visit.data.final === true && visit.data.verdict === true
                )
                .map((visit) => {
                  const date = new Date(visit.data.created_at);
                  const visit_create = date.toLocaleString();
                  return (
                    <tr key={visit.id}>
                      <td>{visit.data.reason}</td>
                      <td>{visit.data.user_id}</td>
                      <td>{visit.data.findate}</td>
                      <td>{visit.data.verdict_id}</td>
                      <td>{visit_create}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <h1 className="display-2" style={{ marginTop: "1em" }}>
          Verdicts
        </h1>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Conclusion</th>
                <th scope="col">Image url</th>
                <th scope="col">Doctor id</th>
                <th scope="col">Created at</th>
              </tr>
            </thead>
            <tbody>
              {verdictList.map((verdict) => {
                const date = new Date(verdict.data.created_at);
                const visit_create = date.toLocaleString();
                return (
                  <tr key={verdict.id}>
                    {verdict.data.image !== null && (
                      <td>
                        <img
                          id="verdictimg_table"
                          max="true"
                          src={verdict.data.image}
                          alt="conclusion_image"
                        />
                      </td>
                    )}
                    {verdict.data.image === null && <td>No image</td>}
                    <td>{verdict.data.text}</td>
                    <td>{verdict.data.doctor_id}</td>
                    <td>{visit_create}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <h1 className="display-2" style={{ marginTop: "1em" }}>
          Users
        </h1>
        <div className="table-responsive">
          <h1 className="display-6">Patients</h1>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Joined</th>
                <th scope="col">Change role</th>
              </tr>
            </thead>
            <tbody>
              {userList
                .filter((user) => user.data.role === 1)
                .map((user) => {
                  const date = new Date(user.data.created_at);
                  const visit_create = date.toLocaleString();
                  return (
                    <tr key={user.id}>
                      <td>
                        {user.data.surname} {user.data.name}
                      </td>
                      <td>{user.data.email}</td>
                      <td>{visit_create}</td>
                      <td>
                        <button
                          id="btn1"
                          className="btn btn-outline-warning"
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#updateModal"
                          data-bs-uid={user.id}
                          data-bs-role={user.data.role}
                        >
                          Change
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="table-responsive">
          <h1 className="display-6">Nurses</h1>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Joined</th>
                <th scope="col">Change role</th>
              </tr>
            </thead>
            <tbody>
              {userList
                .filter((user) => user.data.role === 2)
                .map((user) => {
                  const date = new Date(user.data.created_at);
                  const visit_create = date.toLocaleString();
                  return (
                    <tr key={user.id}>
                      <td>
                        {user.data.surname} {user.data.name}
                      </td>
                      <td>{user.data.email}</td>
                      <td>{visit_create}</td>
                      <td>
                        <button
                          className="btn btn-outline-warning"
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#updateModal"
                          data-bs-uid={user.id}
                          data-bs-role={user.data.role}
                        >
                          Change
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="table-responsive">
          <h1 className="display-6">Doctors</h1>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Joined</th>
                <th scope="col">Change role</th>
              </tr>
            </thead>
            <tbody>
              {userList
                .filter((user) => user.data.role === 3)
                .map((user) => {
                  const date = new Date(user.data.created_at);
                  const visit_create = date.toLocaleString();
                  return (
                    <tr key={user.id}>
                      <td>
                        dr. {user.data.surname} {user.data.name}
                      </td>
                      <td>{user.data.email}</td>
                      <td>{visit_create}</td>
                      <td>
                        <button
                          className="btn btn-outline-warning"
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#updateModal"
                          data-bs-uid={user.id}
                          data-bs-role={user.data.role}
                        >
                          Change
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="table-responsive">
          <h1 className="display-6">Admins</h1>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Joined</th>
              </tr>
            </thead>
            <tbody>
              {userList
                .filter((user) => user.data.role === 5)
                .map((user) => {
                  const date = new Date(user.data.created_at);
                  const visit_create = date.toLocaleString();
                  return (
                    <tr key={user.id}>
                      <td>
                        {user.data.surname} {user.data.name}
                      </td>
                      <td>{user.data.email}</td>
                      <td>{visit_create}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
