import { getDoc, doc, collection, onSnapshot } from "firebase/firestore";
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

  return (
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
  );
}

export default Dashboard;
