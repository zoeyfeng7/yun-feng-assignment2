import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import produce from "immer";
import { useGameState } from "./GameStateContext";
import "./GameOfLife.css";
import NavBar from "./NavBar";
import GridSizeForm from "./GridSizeForm";
import GridDisplay from "./GridDisplay";
import ControlPanel from "./ControlPanel";
import LiveCellsDisplay from "./LiveCellsDisplay";

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = (rows, cols) => {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    grid.push(Array.from(Array(cols), () => 0)); // Initialize each cell to 0 (dead)
  }
  return grid;
};

const generateClusteredGrid = (
  rows,
  cols,
  clusterCount = 5,
  clusterRadius = 3
) => {
  const grid = generateEmptyGrid(rows, cols);
  const centers = [];
  for (let i = 0; i < clusterCount; i++) {
    const center = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    centers.push(center);
  }

  for (const center of centers) {
    for (let i = -clusterRadius; i <= clusterRadius; i++) {
      for (let j = -clusterRadius; j <= clusterRadius; j++) {
        const x = center.x + i;
        const y = center.y + j;
        if (x >= 0 && x < rows && y >= 0 && y < cols) {
          if (Math.random() <= 0.5) {
            // Adjust this probability to control density
            grid[x][y] = 1;
          }
        }
      }
    }
  }

  return grid;
};

const GameOfLife = () => {
  const [gridSize, setGridSize] = useState({ rows: 20, cols: 20 });
  const [grid, setGrid] = useState(() =>
    generateEmptyGrid(gridSize.rows, gridSize.cols)
  );
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;
  const [liveCellsCount, setLiveCellsCount] = useState(0); // New state variable
  const [error, setError] = useState(""); // State variable for storing error messages
  const navigate = useNavigate();
  const { setGrid: setGlobalGrid, setIsRunning } = useGameState();

  const simulateOneStep = () => {
    setGrid((g) => {
      let liveCount = 0; // Initialize current live cell count
      const newGrid = produce(g, (gridCopy) => {
        for (let i = 0; i < gridSize.rows; i++) {
          for (let j = 0; j < gridSize.cols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (
                newI >= 0 &&
                newI < gridSize.rows &&
                newJ >= 0 &&
                newJ < gridSize.cols
              ) {
                neighbors += g[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
              liveCount++; // Cell transitions from dead to alive, increment live cell count
            } else if (g[i][j] === 1) {
              if (neighbors === 2 || neighbors === 3) {
                liveCount++; // Cell stays alive, increment live cell count
              }
            }
          }
        }
      });
      setLiveCellsCount(liveCount); // Update live cell count here
      setGlobalGrid(newGrid);
      return newGrid; // Return new grid state
    });
  };

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    simulateOneStep();
    setTimeout(runSimulation, 100);
  }, [gridSize]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginBottom: "20px",
        }}
      >
        <NavBar />
      </div>
      <GridSizeForm
        gridSize={gridSize}
        setGridSize={setGridSize}
        setError={setError}
        generateEmptyGrid={generateEmptyGrid}
        setGrid={setGrid}
      />
      {error && <div className="errorMessage">{error}</div>}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <GridDisplay grid={grid} setGrid={setGrid} gridSize={gridSize} />
      </div>
      <ControlPanel
        running={running}
        setRunning={setRunning}
        runningRef={runningRef}
        runSimulation={runSimulation}
        setGrid={setGrid}
        generateEmptyGrid={generateEmptyGrid}
        gridSize={gridSize}
        generateClusteredGrid={generateClusteredGrid}
        simulateOneStep={simulateOneStep}
        navigate={navigate}
      />
      <LiveCellsDisplay liveCellsCount={liveCellsCount} />
    </>
  );
};

export default GameOfLife;
