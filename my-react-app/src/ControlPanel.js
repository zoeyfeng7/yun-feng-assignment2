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
        Clear
      </button>
      <button onClick={simulateOneStep}>Next Step</button>
      <button
        onClick={() => {
          navigate("/heatmap");
        }}
      >
        Heatmap
      </button>
    </div>
  );
};

export default ControlPanel;
