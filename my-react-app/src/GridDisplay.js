// GridDisplay.js
import React from "react";
import produce from "immer";

const GridDisplay = ({ grid, setGrid, gridSize }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize.cols}, 20px)`,
      }}
    >
      {grid.map((rows, rowIndex) =>
        rows.map((col, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            onClick={() => {
              const newGrid = produce(grid, (gridCopy) => {
                gridCopy[rowIndex][colIndex] = grid[rowIndex][colIndex] ? 0 : 1; // Toggle cell state
              });
              setGrid(newGrid);
            }}
            style={{
              width: 20,
              height: 20,
              backgroundColor: grid[rowIndex][colIndex] ? "black" : "white",
              border: "solid 1px gray",
            }}
          />
        ))
      )}
    </div>
  );
};

export default GridDisplay;
