// components/TetrisControls.tsx 游戏控制按钮组件
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
        <button onClick={startGame}>Start Game</button>
      )}
      {isGameOver && <button onClick={resetGame}>Restart Game</button>}
    </div>
  );
};

export default TetrisControls;
