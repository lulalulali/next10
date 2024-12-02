// utils/gameLogic.ts 游戏逻辑（如方块生成、移动等）
export const ROWS = 20;
export const COLS = 10;

export const randomTetromino = () => {
  // 方块颜色数组
  const colors = [
    "#ADD8E6", // Light Blue
    "#32CD32", // Lime Green
    "#FFA500", // Bright Orange
    "#FFFF00", // Bright Yellow
    "#EE82EE", // Violet
    "#FF69B4", // Hot Pink
    "#FF0000", // Bright Red
  ];

  // 随机选择一个颜色
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // 随机生成方块形状
  const tetrominoes = [
    [
      [1, 1, 1],
      [0, 1, 0],
    ], // T形
    [
      [1, 1],
      [1, 1],
    ], // O形
    [
      [1, 1, 0],
      [0, 1, 1],
    ], // S形
    [
      [0, 1, 1],
      [1, 1, 0],
    ], // Z形
    [
      [1, 0, 0],
      [1, 1, 1],
    ], // L形
    [
      [0, 0, 1],
      [1, 1, 1],
    ], // J形
    [[1, 1, 1, 1]], // I形
  ];

  // 随机选择一个方块形状
  const randomTetromino =
    tetrominoes[Math.floor(Math.random() * tetrominoes.length)];

  return { shape: randomTetromino, color: randomColor }; // 返回颜色和形状
};

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

export interface ClearRowsResult {
  newGrid: number[][]; // 清除行后的新网格
  clearedRows: number; // 清除的行数
}

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
