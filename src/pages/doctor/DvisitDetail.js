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
  addDoc,
} from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db, storage } from "../../firebase-config";
import { send } from "emailjs-com";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

function DvisitDetail({ isAuth, uid }) {
  let { id } = useParams();
  let navigate = useNavigate();
  const [text, setText] = useState("");
  const [progresspercent, setProgresspercent] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const [visit, setVisit] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDoc(doc(db, "visits", id)).then((docSnap) => {
      if (docSnap.exists()) {
        setVisit({ data: docSnap.data(), id: docSnap.id });
        if (docSnap.data().verdict) {
          getDoc(doc(db, "verdicts", docSnap?.data()?.verdict_id)).then(
            (docSnap) => {
              if (!docSnap.exists()) {
                setVerdict(null);
              } else if (docSnap.data()) {
                setVerdict({ data: docSnap.data(), id: docSnap.id });
              }
            }
          );
        }

        getDoc(doc(db, "users", docSnap.data().user_id)).then((docSnap) => {
          if (!docSnap.exists()) {
            setUser(null);
          } else if (docSnap.data()) {
            setUser({ data: docSnap.data(), id: docSnap.id });
          }
        });
      } else if (!docSnap.exists()) {
        navigate("/visits");
      }
    });
  }, [refreshKey]);

  const deleteVisit = async (id) => {
    if (visit?.data.verdict === true) {
      const vId = visit?.data.verdict_id;
      const visitDoc = doc(db, "visits", id);
      const d = new Date(visit.data.findate).valueOf();
      await deleteDoc(visitDoc)
        .then(() => {
          delVerdict(vId);
          if (d > Date.now()) {
            send(
              "ordination-react",
              "template_udvcgdk",
              {
                from_name: "the ordination team",
                to_name: user.data.name,
                message:
                  "Your upcoming appointment has been deleted, if anything seems wrong with this please contact us or create a new visit.",
                to_email: user.data.email,
              },
              "dupwOtMfl4L3pbXcP"
            );
          }
        })
        .catch(function (error) {
          alert(error);
        });
    } else {
      const visitDoc = doc(db, "visits", id);
      const d = new Date(visit.data.findate).valueOf();
      await deleteDoc(visitDoc)
        .then(() => {
          if (d > Date.now()) {
            send(
              "ordination-react",
              "template_udvcgdk",
              {
                from_name: "the ordination team",
                to_name: user.data.name,
                message:
                  "Your upcoming appointment has been deleted, if anything seems wrong with this please contact us or create a new visit.",
                to_email: user.data.email,
              },
              "dupwOtMfl4L3pbXcP"
            );
          }
        })
        .catch(function (error) {
          alert(error);
        });
    }
    navigate("/visits");
  };

  const updateVisit = async (event) => {
    event.preventDefault();
    const file = event.target[1]?.files[0];
    if (!file) {
      const docRef = doc(db, "visits", id);
      const verdictRef = collection(db, "verdicts");
      await addDoc(verdictRef, {
        text: text,
        doctor_id: auth.currentUser.uid || localStorage.getItem("uid"),
        image: null,
        created_at: Date.now(),
      })
        .catch(function (error) {
          alert(error);
        })
        .then((doc) => {
          const v_id = doc.id;
          updateDoc(docRef, {
            verdict_id: v_id,
            verdict: true,
          }).then(() => {
            setRefreshKey(refreshKey + 1);
          });
        });
    } else if (file) {
      const storageRef = ref(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgresspercent(progress);
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const docRef = doc(db, "visits", id);
            const verdictRef = collection(db, "verdicts");
            addDoc(verdictRef, {
              text: text,
              image: downloadURL,
              doctor_id: auth.currentUser.uid || localStorage.getItem("uid"),
              created_at: Date.now(),
            })
              .catch(function (error) {
                alert(error);
              })
              .then((doc) => {
                const v_id = doc.id;
                updateDoc(docRef, {
                  verdict_id: v_id,
                  verdict: true,
                }).then(() => {
                  setProgresspercent(0);
                  setRefreshKey(refreshKey + 1);
                });
              });
          });
        }
      );
    }
  };
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
  }, []);

  const date_to = new Date(visit?.data.created_at);
  const visit_create = date_to.toLocaleString();

  const delVerdict = async (id_v) => {
    const verdictRef = doc(db, "verdicts", id_v);
    if (verdict?.data.image != null) {
      const imgRef = ref(storage, verdict?.data.image);
      await deleteDoc(verdictRef)
        .then(() => {
          deleteObject(imgRef)
            .then(() => {
              const docRef = doc(db, "visits", id);
              updateDoc(docRef, {
                verdict_id: null,
                verdict: false,
              });
              setText("");
              setRefreshKey(refreshKey + 1);
            })
            .catch((error) => {
              alert(error);
            });
        })
        .catch(function (error) {
          alert(error);
        });
    } else {
      await deleteDoc(verdictRef)
        .then(() => {
          const docRef = doc(db, "visits", id);
          updateDoc(docRef, {
            verdict_id: null,
            verdict: false,
          });
          setText("");
          setRefreshKey(refreshKey + 1);
        })
        .catch(function (error) {
          alert(error);
        });
    }
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

  var deleteModalV = document.getElementById("deleteModalV");
  if (deleteModalV) {
    deleteModalV.addEventListener("show.bs.modal", function (event) {
      var button = event.relatedTarget;

      var recipient = button.getAttribute("data-bs-uid");

      var modalBody = deleteModalV.querySelector(".modal-body");
      var button = document.getElementById("deleteButtonV");

      modalBody.textContent =
        "Are you sure you want to delete verdict with id " + recipient + "?";
      button.onclick = function () {
        delVerdict(recipient);
        document.getElementById("closebtnV").click();
      };
    });
  }

  return (
    <>
      {error &&
        (setTimeout(function () {
          // Closing the alert
          if (error != null) {
            document.querySelector("#error").style.display = "none";
            setError(null);
          }
        }, 5000),
        (
          <div className="alert alert-danger" role="alert" id="error">
            {error}
          </div>
        ))}
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
      <div
        className="modal fade"
        id="deleteModalV"
        tabIndex="-1"
        aria-labelledby="deleteModalLabelV"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabelV">
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
                id="closebtnV"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                id="deleteButtonV"
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
                  {user?.data.name + " " + user?.data.surname}
                </p>
              </div>
              <div className="card-footer bg-transparent">
                Created at {visit_create}
              </div>
            </div>
          </div>
        </div>
        <span style={{ padding: "2em" }} />

        {visit?.data.verdict === false && (
          <div className="row">
            <div className="col-sm">
              <form onSubmit={updateVisit} name="updateVisit_form">
                <h1 className="display-6">Add a conclusion</h1>
                <div className="mb-3">
                  <label htmlFor="textcontrol" className="form-label">
                    Text
                  </label>
                  <textarea
                    className="form-control"
                    id="textcontrol"
                    rows="2"
                    value={text}
                    required
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filecontrol" className="form-label">
                    Attach an image
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="filecontrol"
                  />
                  {progresspercent}%
                </div>
                <button type="submit" className="btn btn-primary">
                  Set
                </button>
              </form>
            </div>
          </div>
        )}
        {visit?.data.verdict === true && (
          <div className="row">
            <h1 className="display-6">Current conclusion</h1>{" "}
            <button
              className="btn btn-outline-danger"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#deleteModalV"
              data-bs-uid={verdict?.id}
            >
              Delete
            </button>
            {verdict?.data.image && (
              <div className="col-sm-4">
                <img
                  id="verdictimg"
                  max="true"
                  src={verdict?.data.image}
                  className="img-fluid img-thumbnail"
                  alt="conclusion_image"
                />
              </div>
            )}
            <div className="col-sm-8">
              <p className="text-start fs-5">{verdict?.data.text}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DvisitDetail;
