import React, { useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Post({ setIsAuth }) {
  let navigate = useNavigate();
  const isAuth = sessionStorage.getItem("isAuth");

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);
  return <div>Post</div>;
}

export default Post;
