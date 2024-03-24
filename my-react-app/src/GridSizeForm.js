// GridSizeForm.js
import React from "react";

const GridSizeForm = ({
  gridSize,
  setGridSize,
  setError,
  generateEmptyGrid,
  setGrid,
}) => {
  // Accept setGrid here
  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        const newRows = parseInt(e.target.rows.value);
        const newCols = parseInt(e.target.cols.value);
        if (newRows >= 3 && newRows <= 40 && newCols >= 3 && newCols <= 40) {
          setGridSize({ rows: newRows, cols: newCols });
          setGrid(generateEmptyGrid(newRows, newCols)); // Use setGrid here to set the new grid
          setError("");
        } else {
          setError("Rows and cols must be between 3 and 40.");
        }
      }}
    >
      <input
        className="input"
        name="rows"
        type="number"
        defaultValue={gridSize.rows}
        placeholder="Height"
      />
      <input
        className="input"
        name="cols"
        type="number"
        defaultValue={gridSize.cols}
        placeholder="Width"
      />
      <button className="button" type="submit">
        Update Size
      </button>
    </form>
  );
};

export default GridSizeForm;
