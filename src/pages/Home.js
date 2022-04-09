import React from "react";
import { auth } from "../firebase-config";

function Home() {
  return <div>Welcome home {auth.currentUser?.email}</div>;
}

export default Home;
