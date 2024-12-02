// components/TetrisBoard.tsx  游戏网格组件
import React from "react";

interface TetrisBoardProps {
  grid: number[][];
  piece: number[][];
  position: { row: number; col: number };
}

const TetrisBoard: React.FC<TetrisBoardProps> = ({ grid, piece, position }) => {
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
              backgroundColor: piece.some((line, y) =>
                line.some(
                  (block, x) =>
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
