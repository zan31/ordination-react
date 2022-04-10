import React from "react";

function Home() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return <div>Welcome home {user?.name}</div>;
}

export default Home;
