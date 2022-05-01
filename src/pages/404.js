import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div>
      <p style={{ textAlign: "center" }}>
        <Link to="/">Go to Home </Link>
      </p>
    </div>
  );
}

export default NotFoundPage;
