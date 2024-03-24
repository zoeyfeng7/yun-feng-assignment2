import React from "react";
import { useNavigate } from "react-router-dom";

const ControlPanel = ({
  running,
  setRunning,
  runningRef,
  runSimulation,
  setGrid,
  generateEmptyGrid,
  gridSize,
  generateClusteredGrid,
  simulateOneStep,
  longerLastingCellsActive, // 确保添加这一行
  setLongerLastingCellsActive, // 以及这一行
}) => {
  const navigate = useNavigate(); // Correct usage of useNavigate hook.

  return (
    <div className="controls">
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "Stop" : "AutoPlay"}
      </button>
      <button onClick={simulateOneStep}>Next Frame</button>
      <button
        onClick={() => {
          setGrid(
            generateEmptyGrid(gridSize.rows, gridSize.cols).map((row) =>
              row.map(() => (Math.random() <= 0.05 ? 1 : 0))
            )
          );
        }}
      >
        Randomize
      </button>
      <button
        onClick={() => {
          setGrid(generateClusteredGrid(gridSize.rows, gridSize.cols));
        }}
      >
        Clusterize
      </button>
      <button
        onClick={() => setGrid(generateEmptyGrid(gridSize.rows, gridSize.cols))}
      >
        Reset
      </button>
      <button
        onClick={() => {
          navigate("/heatmap");
        }}
      >
        Heatmap
      </button>
      <button
        onClick={() => setLongerLastingCellsActive(!longerLastingCellsActive)}
      >
        {longerLastingCellsActive
          ? "Disable Longer Lasting Cells"
          : "Enable Longer Lasting Cells"}
      </button>
    </div>
  );
};

export default ControlPanel;
