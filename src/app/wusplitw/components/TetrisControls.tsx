// TetrisControls.tsx
import React from "react";

interface TetrisControlsProps {
  startGame: () => void;
  resetGame: () => void;
  isPlaying: boolean;
  isGameOver: boolean;
}

const TetrisControls: React.FC<TetrisControlsProps> = ({
  startGame,
  resetGame,
  isPlaying,
  isGameOver,
}) => {
  return (
    <div>
      <button onClick={startGame} disabled={isPlaying}>
        Start Game
      </button>
      <button onClick={resetGame} disabled={isPlaying || isGameOver}>
        Reset Game
      </button>
    </div>
  );
};

export default TetrisControls;
