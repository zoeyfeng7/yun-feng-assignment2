import React from "react";
import NavBar from "./NavBar";

const HomePage = () => (
  <div className="container">
    <NavBar />
    <h1>Welcome to Conway's Game of Life</h1>
    <p>
      Conway’s Game of Life is a game that is “played” based on a grid system.
      Every individual location on the grid can be understood as a cell. The
      game, or simulation, occurs over iterations, or generations. After a
      generation, a cell may change from living or dead based on how many living
      or dead neighbors it had in a previous iteration. A neighbor is any
      immediately adjacent spot on the grid (horizontal, vertical or diagonal).
      We can understand this more clearly with an example and a clear
      demonstration of the rules.
    </p>
    <p>
      <strong>Rules of Life:</strong>
      <ul>
        <li>
          A living cell with fewer than two living neighbors dies, as if by
          underpopulation.
        </li>
        <li>
          A living cell with two or three living neighbors lives on to the next
          generation.
        </li>
        <li>
          A living cell with more than three living neighbors dies, as if by
          overpopulation.
        </li>
        <li>
          A dead cell with exactly three living neighbors becomes a living cell,
          as if by reproduction.
        </li>
      </ul>
    </p>
  </div>
);

export default HomePage;
