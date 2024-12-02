import React from "react";
import { Tetromino } from "../utils/gameLogic"; // 引入 Tetromino 类型

interface TetrisBoardProps {
  grid: number[][]; // 网格
  piece: Tetromino; // 将 piece 的类型改为 Tetromino
  position: { row: number; col: number }; // 方块的位置
}

const TetrisBoard: React.FC<TetrisBoardProps> = ({ grid, piece, position }) => {
  // 在这里，你应该通过 piece.shape 来获取方块的形状
  const shape = piece.shape;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: `repeat(20, 20px)`,
        gridTemplateColumns: `repeat(10, 20px)`,
        gap: "0px",
        outline: "none",
        backgroundColor: "#d9d9d9",
        border: "2px solid #333",
        boxSizing: "border-box",
        borderRadius: "10px",
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.7)",
        overflow: "hidden",
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: shape.some((line: number[], y: number) =>
                line.some(
                  (block: number, x: number) =>
                    block &&
                    position.row + y === rowIndex &&
                    position.col + x === colIndex
                )
              )
                ? "blue"
                : cell
                ? "gray"
                : "transparent",
              border: "1px solid #333",
            }}
          />
        ))
      )}
    </div>
  );
};

export default TetrisBoard;
