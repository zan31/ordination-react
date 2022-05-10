import { React } from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div id="notfound">
      <div class="notfound">
        <div class="notfound-404">
          <h1>404</h1>
        </div>
        <h2>Oops, The Page you are looking for can't be found!</h2>
        <span className="arrow"></span>
        <Link to="/">Go to Home </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
