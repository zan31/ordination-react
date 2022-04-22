import React, { useEffect, useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase-config";

function UserData({ isAuth, userv, userd, setUserd }) {
  let navigate = useNavigate();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [adress, setAdress] = useState("");
  const [disease, setDisease] = useState(null);
  const [date, setDate] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    } else if (isAuth) {
      if (!userv || !auth.currentUser.emailVerified) {
        navigate("/verify-email");
      } else if (userv) {
        if (userd) {
          navigate(-1);
        }
      }
    }
  }, []);

  const createUser = async (event) => {
    event.preventDefault();
    if (
      name !== "" &&
      surname !== "" &&
      adress !== "" &&
      date !== "" &&
      height !== "" &&
      weight !== ""
    ) {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        name: name,
        surname: surname,
        adress: adress,
        disease: disease || "N/A",
        date: date,
        height: height,
        weight: weight,
        role: 1,
        created_at: Date.now(),
      })
        .then(() => {
          setUserd(true);
          localStorage.setItem("userd", true);
          navigate("/");
        })
        .catch((err) => alert(err.message));
    }
  };

  return (
    <div className="container">
      <form onSubmit={createUser} name="registration_form">
        <div className="mb-3">
          <label htmlFor="namecontrol" className="form-label">
            Name
          </label>
          <input
            className="form-control"
            id="namecontrol"
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="surcontrol" className="form-label">
            Surname
          </label>
          <input
            className="form-control"
            type="text"
            id="surcontrol"
            value={surname}
            required
            onChange={(e) => setSurname(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="adressoncontrol" className="form-label">
            Adress
          </label>
          <input
            className="form-control"
            type="text"
            id="adressconcontrol"
            value={adress}
            required
            onChange={(e) => setAdress(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="datecontrol" className="form-label">
            Date of birth
          </label>
          <input
            className="form-control"
            id="datecontrol"
            type="date"
            value={date}
            required
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="diseasecontrol" className="form-label">
            Family diseases
          </label>
          <input
            className="form-control"
            type="text"
            id="diseaseconcontrol"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="heightcontrol" className="form-label">
            Height
          </label>
          <input
            className="form-control"
            type="number"
            id="heightconcontrol"
            value={height}
            required
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="weightcontrol" className="form-label">
            Weight
          </label>
          <input
            className="form-control"
            type="number"
            id="weightconcontrol"
            value={weight}
            required
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default UserData;
