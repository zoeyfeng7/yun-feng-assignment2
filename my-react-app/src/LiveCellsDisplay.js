// LiveCellsDisplay.js
import React from "react";

const LiveCellsDisplay = ({ liveCellsCount }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      Live Cells: {liveCellsCount}
    </div>
  );
};

export default LiveCellsDisplay;
