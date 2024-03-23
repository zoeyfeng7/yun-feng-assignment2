import React, { useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import produce from "immer";
import { useGameState } from "./GameStateContext";
import "./GameOfLife.css";
import NavBar from "./NavBar";

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
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          const newRows = parseInt(e.target.rows.value);
          const newCols = parseInt(e.target.cols.value);
          if (newRows >= 3 && newRows <= 40 && newCols >= 3 && newCols <= 40) {
            setGridSize({ rows: newRows, cols: newCols });
            setGrid(generateEmptyGrid(newRows, newCols));
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
      {error && <div className="errorMessage">{error}</div>}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
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
                    gridCopy[rowIndex][colIndex] = grid[rowIndex][colIndex]
                      ? 0
                      : 1; // Toggle cell state
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
      </div>
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
          onClick={() =>
            setGrid(generateEmptyGrid(gridSize.rows, gridSize.cols))
          }
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
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        Live Cells: {liveCellsCount}
      </div>
    </>
  );
};

export default GameOfLife;
