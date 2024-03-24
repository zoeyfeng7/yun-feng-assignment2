import React, { useRef, useEffect } from "react";
import { useGameState } from "./GameStateContext"; // 导入 useGameState 钩子

const resolution = 10;
const width = 800;
const height = 800;

const HeatMapPage = () => {
  const { grid } = useGameState();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !grid.length) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    grid.forEach((rows, colIdx) => {
      rows.forEach((cell, rowIdx) => {
        const color = cell ? `rgb(0, 255, 0)` : `rgb(255, 0, 0)`;
        ctx.fillStyle = color;
        ctx.fillRect(
          colIdx * resolution,
          rowIdx * resolution,
          resolution - 1,
          resolution - 1
        );
      });
    });
  }, [grid]);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default HeatMapPage;
