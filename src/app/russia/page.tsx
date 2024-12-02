"use client";
import React, { useEffect, useState } from "react";

const ROWS = 20;
const COLS = 10;

// 初始化游戏网格
const createGrid = () => {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
};

const SHAPES: { [key: string]: number[][][] } = {
  I: [
    [[1, 1, 1, 1]], // 0° 旋转
    [[1], [1], [1], [1]], // 90° 旋转
  ],
  O: [
    [
      [1, 1],
      [1, 1],
    ], // 0° 旋转
  ],
  T: [
    [
      [0, 1, 0],
      [1, 1, 1],
    ], // 0° 旋转
    [
      [1, 0],
      [1, 1],
      [1, 0],
    ], // 90° 旋转
    [
      [1, 1, 1],
      [0, 1, 0],
    ], // 180° 旋转
    [
      [0, 1],
      [1, 1],
      [0, 1],
    ], // 270° 旋转
  ],
  L: [
    [
      [1, 0, 0],
      [1, 1, 1],
    ], // 0° 旋转
    [
      [1, 1],
      [1, 0],
      [1, 0],
    ], // 90° 旋转
    [
      [1, 1, 1],
      [0, 0, 1],
    ], // 180° 旋转
    [
      [0, 1],
      [0, 1],
      [1, 1],
    ], // 270° 旋转
  ],
  J: [
    [
      [0, 0, 1],
      [1, 1, 1],
    ], // 0° 旋转
    [
      [1, 0],
      [1, 0],
      [1, 1],
    ], // 90° 旋转
    [
      [1, 1, 1],
      [1, 0, 0],
    ], // 180° 旋转
    [
      [1, 1],
      [0, 1],
      [0, 1],
    ], // 270° 旋转
  ],
  S: [
    [
      [0, 1, 1],
      [1, 1, 0],
    ], // 0° 旋转
    [
      [1, 0],
      [1, 1],
      [0, 1],
    ], // 90° 旋转
  ],
  Z: [
    [
      [1, 1, 0],
      [0, 1, 1],
    ], // 0° 旋转
    [
      [0, 1],
      [1, 1],
      [1, 0],
    ], // 90° 旋转
  ],
};

// 确定方块的初始位置
const INITIAL_POSITION = { x: Math.floor(COLS / 2) - 1, y: 0 }; // 顶部中心

const Tetris: React.FC = () => {
  const [grid, setGrid] = useState(createGrid());
  const [currentShape, setCurrentShape] = useState(SHAPES.I[0]);
  const [currentPosition, setCurrentPosition] = useState(INITIAL_POSITION);
  const [isGameOver, setIsGameOver] = useState(false);

  // 在网格中放置方块
  const placeBlock = (
    shape: number[][],
    position: { x: number; y: number },
    fixed: boolean = false
  ) => {
    shape.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value) {
          const gridX = position.x + colIndex;
          const gridY = position.y + rowIndex;
          if (fixed) {
            grid[gridY][gridX] = { color: "blue" }; // 固定方块颜色
          } else {
            // 仅在当前方块位置渲染颜色
            if (!grid[gridY]) return; // 防止越界
            if (!grid[gridY][gridX]) {
              grid[gridY][gridX] = { color: "lightblue" }; // 当前方块颜色
            }
          }
        }
      });
    });
  };

  // 检查方块是否可以移动
  const canMove = (shape: number[][], position: { x: number; y: number }) => {
    return shape.every((row, rowIndex) => {
      return row.every((value, colIndex) => {
        if (!value) return true; // 空格子可以移动
        const newX = position.x + colIndex;
        const newY = position.y + rowIndex;
        return (
          newX >= 0 && // 确保不超出左边界
          newX < COLS && // 确保不超出右边界
          newY < ROWS && // 确保不超出底部
          (!grid[newY] || !grid[newY][newX]) // 确保不碰到其他方块
        );
      });
    });
  };

  // 方块下落逻辑
  const dropBlock = () => {
    // 清空当前方块在网格中的位置
    const tempGrid = createGrid();
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          tempGrid[rowIndex][colIndex] = cell; // 保留已固定的方块
        }
      });
    });
    console.log("Current Position:", currentPosition);
    console.log("Current Shape:", currentShape);
    console.log("Grid State:", grid);

    // 清空当前方块在临时网格中的位置
    currentShape.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value) {
          const gridX = currentPosition.x + colIndex;
          const gridY = currentPosition.y + rowIndex;
          if (tempGrid[gridY]) {
            tempGrid[gridY][gridX] = null; // 清空当前方块的轨迹
          }
        }
      });
    });

    // 检查方块是否可以下落
    if (
      canMove(currentShape, { x: currentPosition.x, y: currentPosition.y + 1 })
    ) {
      // 如果可以下落，更新位置
      setCurrentPosition((prev) => ({ ...prev, y: prev.y + 1 }));
    } else {
      // 方块到达底部或碰到其他方块，固定方块
      placeBlock(currentShape, currentPosition, true); // 固定方块
      // 生成新方块
      setCurrentPosition(INITIAL_POSITION); // 重置为初始位置
      setCurrentShape(SHAPES.I[0]); // 这里可以随机生成新方块
      // 检查游戏是否结束
      if (tempGrid[0].some((cell) => cell)) {
        setIsGameOver(true);
      }
    }

    // 更新网格状态
    setGrid(tempGrid);
  };

  // 旋转方块
  const rotateShape = (shape: number[][]) => {
    const rotated = shape[0].map((_, index) =>
      shape.map((row) => row[index]).reverse()
    );
    return rotated;
  };

  // 处理键盘事件
  const handleKeyDown = (event: KeyboardEvent) => {
    if (isGameOver) return;

    switch (event.key) {
      case "ArrowLeft":
        if (
          canMove(currentShape, {
            x: currentPosition.x - 1,
            y: currentPosition.y,
          })
        ) {
          setCurrentPosition((prev) => ({ ...prev, x: prev.x - 1 }));
        }
        break;
      case "ArrowRight":
        if (
          canMove(currentShape, {
            x: currentPosition.x + 1,
            y: currentPosition.y,
          })
        ) {
          setCurrentPosition((prev) => ({ ...prev, x: prev.x + 1 }));
        }
        break;
      case "ArrowUp":
        const rotatedShape = rotateShape(currentShape);
        if (canMove(rotatedShape, currentPosition)) {
          setCurrentShape(rotatedShape);
        }
        break;
      case "ArrowDown":
        dropBlock(); // 快速下落
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isGameOver) {
        dropBlock();
      }
    }, 1000); // 每秒下落一次

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPosition, currentShape, isGameOver]);

  // 在网格中放置当前方块
  placeBlock(currentShape, currentPosition); // 仅在当前方块位置渲染颜色

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 30px)`,
          gridTemplateRows: `repeat(${ROWS}, 30px)`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: "30px",
                height: "30px",
                border: "1px solid #ccc",
                backgroundColor: cell ? cell.color : "white", // 根据方块信息设置颜色
              }}
            />
          ))
        )}
      </div>
      {isGameOver && (
        <div style={{ position: "absolute", color: "red" }}>游戏结束</div>
      )}
    </div>
  );
};

export default Tetris;
