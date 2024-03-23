import React, { useRef, useEffect, useState } from "react";

const resolution = 10;
const width = 800;
const height = 800;
const COLS = width / resolution;
const ROWS = height / resolution;

class Cell {
  constructor() {
    this.currentstate = Math.floor(Math.random() * 2);
    this.total = 0;
  }

  setState(state) {
    this.currentstate = state;
    this.total += state;
  }
}

const buildGrid = () => {
  return new Array(COLS)
    .fill(null)
    .map(() => new Array(ROWS).fill(null).map(() => new Cell()));
};

const HeatMapPage = () => {
  const canvasRef = useRef(null);
  const [grid, setGrid] = useState(buildGrid());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    const update = () => {
      const nextGrid = nextGen(grid);
      render(nextGrid, ctx);
      setGrid(nextGrid);
      requestAnimationFrame(update);
    };

    update();
  }, [grid]); // Re-run effect if `grid` changes

  const nextGen = (grid) => {
    const newGrid = grid.map((arr) => arr.map((cell) => new Cell()));
    const currentGen = grid.map((arr) => arr.map((cell) => cell.currentstate));

    for (let col = 0; col < currentGen.length; col++) {
      for (let row = 0; row < currentGen[col].length; row++) {
        const cell = currentGen[col][row];
        let numNeighbours = 0;
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            if (i === 0 && j === 0) {
              continue;
            }
            const x_cell = col + i;
            const y_cell = row + j;

            if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
              numNeighbours += currentGen[x_cell][y_cell];
            }
          }
        }

        // Rules
        if (cell === 1 && (numNeighbours < 2 || numNeighbours > 3)) {
          newGrid[col][row].setState(0);
        } else if (cell === 0 && numNeighbours === 3) {
          newGrid[col][row].setState(1);
        } else {
          newGrid[col][row].setState(cell);
        }
      }
    }
    return newGrid;
  };

  const render = (grid, ctx) => {
    let maxTotal = 0;
    grid.forEach((column) =>
      column.forEach((cell) => {
        if (cell.total > maxTotal) {
          maxTotal = cell.total;
        }
      })
    );

    grid.forEach((column, col) =>
      column.forEach((cell, row) => {
        ctx.beginPath();
        ctx.rect(col * resolution, row * resolution, resolution, resolution);
        const normalised = cell.total / maxTotal;
        const h = (1.0 - normalised) * 240;
        ctx.fillStyle = `hsl(${h}, 100%, 50%)`;
        ctx.fill();
      })
    );
  };

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default HeatMapPage;
