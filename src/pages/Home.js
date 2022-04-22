import { collection, onSnapshot } from "firebase/firestore";
import { React, useEffect, useState } from "react";
import { db } from "../firebase-config";

function Home() {
  const [userLists, setUserList] = useState([]);

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
  return (
    <div className="homePage">
      {userLists.map((user) => {
        return (
          <div key={user.id} className="post">
            <div className="postHeader">
              <div className="title">
                <h1> {user.data.name}</h1>
              </div>
            </div>
            <div className="postTextContainer"> {user.data.adress} </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
