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
  clusterRadius = 3,
  targetDensity = 0.075 // Targeting the middle of 5-10% for cell alive density
) => {
  const grid = generateEmptyGrid(rows, cols);
  const totalCells = rows * cols;
  const targetAliveCells = Math.floor(totalCells * targetDensity);
  let aliveCells = 0;

  const centers = [];
  for (let i = 0; i < clusterCount && aliveCells < targetAliveCells; i++) {
    const center = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    centers.push(center);

    for (
      let i = -clusterRadius;
      i <= clusterRadius && aliveCells < targetAliveCells;
      i++
    ) {
      for (
        let j = -clusterRadius;
        j <= clusterRadius && aliveCells < targetAliveCells;
        j++
      ) {
        const x = center.x + i;
        const y = center.y + j;
        if (x >= 0 && x < rows && y >= 0 && y < cols) {
          // Adjust this probability dynamically to control density
          // Lowering the probability as we approach the target density
          const remainingCells = targetAliveCells - aliveCells;
          const remainingDensity =
            remainingCells / (totalCells - (i * rows + j));
          if (Math.random() <= Math.min(remainingDensity * 2, 1)) {
            if (grid[x][y] === 0) {
              // Check to ensure we're not overwriting an already alive cell
              grid[x][y] = 1;
              aliveCells++;
            }
          }
        }
      }
    }
  }

  return grid;
};

const generateLifeFramesGrid = (rows, cols) => {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    grid.push(Array.from(Array(cols), () => 0)); // Initialize all cells with 0 life frames
  }
  return grid;
};

const tryMoveCellToClosestSpot = (grid, x, y) => {
  // Define possible directions for movement: right, left, down, up
  const directions = [
    [0, 1], // Right
    [0, -1], // Left
    [1, 0], // Down
    [-1, 0], // Up
  ];

  // Iterate through each possible direction
  for (let [dx, dy] of directions) {
    const newX = x + dx;
    const newY = y + dy;

    // Check if the new position is within the grid boundaries
    if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length) {
      // Check if the new position is empty (no cell alive there)
      if (grid[newX][newY].alive === 0) {
        // Move the cell to the new position: mark it as alive and reset its lifespan
        grid[newX][newY] = { alive: 1, lifespan: 2 }; // Set the new cell as alive and reset lifespan
        grid[x][y] = { alive: 0, lifespan: 2 }; // Mark the original cell as dead
        return true; // Indicate that the cell was successfully moved
      }
    }
  }

  return false; // Indicate that no empty spot was found for movement
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
  const { setGrid: setGlobalGrid } = useGameState();
  const [longerLastingCellsActive, setLongerLastingCellsActive] =
    useState(false);
  const [lifeFramesGrid, setLifeFramesGrid] = useState(() =>
    generateLifeFramesGrid(gridSize.rows, gridSize.cols)
  );

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

            if (longerLastingCellsActive && (neighbors < 2 || neighbors > 3)) {
              const moved = tryMoveCellToClosestSpot(gridCopy, i, j);
              if (!moved) {
                gridCopy[i][j] = 0;
              } else {
                liveCount++;
              }
            } else {
              if (neighbors < 2 || neighbors > 3) {
                gridCopy[i][j] = 0;
              } else if (g[i][j] === 0 && neighbors === 3) {
                gridCopy[i][j] = 1;
                liveCount++;
              } else if (
                g[i][j] === 1 &&
                (neighbors === 2 || neighbors === 3)
              ) {
                liveCount++;
              }
            }
          }
        }
      });
      setLiveCellsCount(liveCount);
      setGlobalGrid(newGrid);
      return newGrid;
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
        longerLastingCellsActive={longerLastingCellsActive}
        setLongerLastingCellsActive={setLongerLastingCellsActive}
      />
      <LiveCellsDisplay liveCellsCount={liveCellsCount} />
    </>
  );
};

export default GameOfLife;
