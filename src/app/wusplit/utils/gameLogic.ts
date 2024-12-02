// utils/gameLogic.ts 游戏逻辑（如方块生成、移动等）
export const ROWS = 20;
export const COLS = 10;

export const TETROMINOS = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

export const randomTetromino = () =>
  Object.values(TETROMINOS)[
    Math.floor(Math.random() * Object.values(TETROMINOS).length)
  ];

export const createGrid = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(0));

export const isValidMove = (
  { row, col }: { row: number; col: number },
  pieceShape: number[][],
  grid: number[][]
) => {
  return pieceShape.every((line, y) =>
    line.every((cell, x) => {
      if (!cell) return true;
      const newRow = row + y;
      const newCol = col + x;
      return (
        newRow >= 0 &&
        newRow < ROWS &&
        newCol >= 0 &&
        newCol < COLS &&
        grid[newRow][newCol] === 0
      );
    })
  );
};

export const clearRows = (newGrid: number[][]) => {
  const filteredGrid = newGrid.filter((row) => row.some((cell) => cell === 0));
  const rowsToAdd = ROWS - filteredGrid.length;
  const emptyRows = Array.from({ length: rowsToAdd }, () =>
    Array(COLS).fill(0)
  );
  return [...emptyRows, ...filteredGrid];
};

export const mergePiece = (
  piece: number[][],
  position: { row: number; col: number },
  grid: number[][]
) => {
  const newGrid = grid.map((row) => [...row]);
  piece.forEach((line, y) =>
    line.forEach((cell, x) => {
      if (cell) {
        newGrid[position.row + y][position.col + x] = 1;
      }
    })
  );
  return newGrid;
};
