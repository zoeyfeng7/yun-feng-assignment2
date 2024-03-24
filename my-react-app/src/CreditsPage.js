import React from "react";
import NavBar from "./NavBar";

const CreditsPage = () => {
  return (
    <div className="container">
      <NavBar /> {}
      <h1>Credits Page</h1>
      <p>
        This simulation of Conway's Game of Life was developed by{" "}
        <strong>Yun Feng</strong>.
      </p>
      <p>
        My GitHub repository{" "}
        <strong>https://github.com/zoeyfeng7/yun-feng-assignment2</strong>
      </p>
    </div>
  );
};

export default CreditsPage;
