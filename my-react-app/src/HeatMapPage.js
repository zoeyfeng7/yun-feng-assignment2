import React, { useRef, useEffect } from "react";
import { useGameState } from "./GameStateContext"; // 导入 useGameState 钩子

const resolution = 10;
const width = 800;
const height = 800;

const HeatMapPage = () => {
  const { grid } = useGameState(); // 使用 useGameState 钩子来获取状态
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !grid.length) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    // 渲染热力图的逻辑
    grid.forEach((rows, colIdx) => {
      rows.forEach((cell, rowIdx) => {
        // 假设这里的 cell 是一个简单的布尔值或一个包含生命状态的对象
        // 你可能需要根据实际情况调整这里的代码
        const color = cell ? `rgb(0, 255, 0)` : `rgb(255, 0, 0)`; // 基于细胞状态选择颜色
        ctx.fillStyle = color;
        ctx.fillRect(
          colIdx * resolution,
          rowIdx * resolution,
          resolution - 1,
          resolution - 1
        );
      });
    });
  }, [grid]); // 当 grid 更新时，重新渲染热力图

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default HeatMapPage;
