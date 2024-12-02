// components/TetrisControls.tsx 游戏控制按钮组件
"use client";
import React from "react";

interface TetrisControlsProps {
  isPlaying: boolean;
  isGameOver: boolean;
  startGame: () => void;
  resetGame: () => void;
}

const TetrisControls: React.FC<TetrisControlsProps> = ({
  isPlaying,
  isGameOver,
  startGame,
  resetGame,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {!isPlaying && !isGameOver && (
        <button
          onClick={startGame}
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          Start Game
        </button>
      )}
      {isGameOver && (
        <button
          onClick={resetGame}
          style={{
            backgroundColor: "#f44336",
            color: "white",
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          Reset Game
        </button>
      )}
    </div>
  );
};

export default TetrisControls;
