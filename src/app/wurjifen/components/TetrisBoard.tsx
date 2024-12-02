// components/TetrisBoard.tsx  游戏网格组件
"use client";
import React, { useState, useEffect } from "react";

interface TetrisBoardProps {
  grid: number[][]; // 游戏网格
  piece: number[][]; // 当前方块的形状
  position: { row: number; col: number }; // 方块的位置
  color: string; // 方块的颜色
  onScoreChange: (score: number) => void; // 分数变化时的回调
}

const TetrisBoard: React.FC<TetrisBoardProps> = ({
  grid,
  piece,
  position,
  color,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [score, setScore] = useState(0); // 初始分数为 0

  // 确保客户端渲染时更新状态
  useEffect(() => {
    setIsClient(true); // 只在客户端设置此状态
  }, []);

  if (!isClient) {
    // 如果不是客户端渲染，直接返回一个静态的占位符
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 30px)",
          gridTemplateRows: "repeat(20, 30px)",
          gap: "1px",
          border: "2px solid #333",
        }}
      />
    );
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(10, 30px)", // 10列
        gridTemplateRows: "repeat(20, 30px)", // 20行
        gap: "0px",
        border: "2px solid #333",
        position: "relative",
        height: "600px", // 设置容器的总高度
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const backgroundColor = cell === 0 ? "#f4f4f4" : "#333"; // 空格是背景色
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: "30px",
                height: "30px",
                backgroundColor,
                border: "1px solid #ddd",
              }}
            />
          );
        })
      )}
      {piece.map((row, rowIndex) =>
        row.map(
          (cell, colIndex) =>
            cell && (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: color,
                  // 使用传入的颜色
                  border: "0px solid #ddd",
                  // 通过计算 position 将方块位置对齐
                  position: "absolute",
                  top: (position.row + rowIndex) * 30 + "px",
                  // 方块的纵坐标
                  left: (position.col + colIndex) * 30 + "px",
                  // 方块的横坐标
                }}
              />
            )
        )
      )}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          color: "#fff",
          fontSize: "20px",
        }}
      >
        Score: {score} {/* 显示当前得分 */}
      </div>
    </div>
  );
};

export default TetrisBoard;
