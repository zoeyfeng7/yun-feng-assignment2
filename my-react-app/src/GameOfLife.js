import React, { useState, useCallback, useRef } from "react";
import produce from "immer";

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

const GameOfLife = () => {
  const [gridSize, setGridSize] = useState({ rows: 20, cols: 20 });
  const [grid, setGrid] = useState(() =>
    generateEmptyGrid(gridSize.rows, gridSize.cols)
  );
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;
  const [liveCellsCount, setLiveCellsCount] = useState(0); // 新的状态变量
  const [error, setError] = useState(""); // 状态变量用于存储错误消息

  const simulateOneStep = () => {
    setGrid((g) => {
      let liveCount = 0; // 初始化当前活细胞数
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
              liveCount++; // 细胞从死变活，增加活细胞计数
            } else if (g[i][j] === 1) {
              if (neighbors === 2 || neighbors === 3) {
                liveCount++; // 细胞保持活着，增加活细胞计数
              }
            }
          }
        }
      });
      setLiveCellsCount(liveCount); // 在这里更新活细胞数
      return newGrid; // 返回新的网格状态
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const newRows = parseInt(e.target.rows.value);
          const newCols = parseInt(e.target.cols.value);
          if (newRows >= 3 && newRows <= 40 && newCols >= 3 && newCols <= 40) {
            setGridSize({ rows: newRows, cols: newCols });
            setGrid(generateEmptyGrid(newRows, newCols));
            setError(""); // 如果输入有效，则清除错误消息
          } else {
            // 设置错误消息，但不更新网格大小
            setError("Rows and cols must be between 3 and 40.");
          }
        }}
      >
        <input
          name="rows"
          type="number"
          defaultValue={gridSize.rows}
          placeholder="Height"
        />
        <input
          name="cols"
          type="number"
          defaultValue={gridSize.cols}
          placeholder="Width"
        />
        <button type="submit">Update Size</button>
      </form>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
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
          {running ? "Stop" : "Start"}
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
          onClick={() =>
            setGrid(generateEmptyGrid(gridSize.rows, gridSize.cols))
          }
        >
          Clear
        </button>
        <button onClick={simulateOneStep}>Next Step</button>
      </div>
      <div style={{ marginTop: "20px" }}>Live Cells: {liveCellsCount}</div>
    </>
  );
};

export default GameOfLife;
