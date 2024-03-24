import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

const NavBar = () => {
  return (
    <nav className="navbar">
      <Link to="/">HomePage</Link>
      <Link to="/GameOfLife">Start Simulation</Link>
      <Link to="/Credits">CreditsPage</Link>
    </nav>
  );
};

export default NavBar;
