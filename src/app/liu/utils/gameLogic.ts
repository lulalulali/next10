// utils/gameLogic.ts
export type Tetromino = {
  shape: number[][]; // 方块的形状，使用二维数组表示
};

// 创建初始网格
export const createGrid = (): number[][] => {
  const grid: number[][] = [];
  for (let row = 0; row < 20; row++) {
    grid.push(Array(10).fill(0)); // 初始化网格，20行10列
  }
  return grid;
};

// 随机生成一个方块
export const randomTetromino = (): Tetromino => {
  const tetrominos: number[][][] = [
    [[1, 1, 1], [0, 1, 0]], // T形
    [[1, 1], [1, 1]],       // 方形
    [[1, 1, 0], [0, 1, 1]], // S形
    [[0, 1, 1], [1, 1, 0]], // Z形
    [[1, 1, 1, 1]],         // I形
  ];
  const random = tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return { shape: random };
};

// 检查方块是否有效
export const isValidMove = (
  grid: number[][],
  piece: Tetromino,
  position: { row: number; col: number }
) => {
  // 检查方块是否越界或与已存在方块重叠
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (
        piece.shape[y][x] &&
        (position.row + y >= grid.length || position.col + x < 0 || position.col + x >= grid[0].length || grid[position.row + y][position.col + x])
      ) {
        return false;
      }
    }
  }
  return true;
};

// 移动方块
export const movePiece = (
  grid: number[][],
  piece: Tetromino,
  position: { row: number; col: number },
  deltaRow: number,
  deltaCol: number
) => {
  const newPosition = { row: position.row + deltaRow, col: position.col + deltaCol };
  if (isValidMove(grid, piece, newPosition)) {
    return { newGrid: grid, position: newPosition };
  }
  return { newGrid: grid, position };
};

// 开始游戏
export const startGame = (
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
  setGrid: React.Dispatch<React.SetStateAction<number[][]>>,
  setPiece: React.Dispatch<React.SetStateAction<Tetromino>>,
  setPosition: React.Dispatch<React.SetStateAction<{ row: number; col: number }>>
) => {
  setIsPlaying(true);
  setGrid(createGrid()); // 重置网格
  setPiece(randomTetromino()); // 随机生成新方块
  setPosition({ row: 0, col: 5 }); // 初始位置
};

// 重置游戏
export const resetGame = (
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
  setGrid: React.Dispatch<React.SetStateAction<number[][]>>,
  setPiece: React.Dispatch<React.SetStateAction<Tetromino>>,
  setPosition: React.Dispatch<React.SetStateAction<{ row: number; col: number }>>
) => {
  setIsPlaying(false);
  setGrid(createGrid()); // 重置网格
  setPiece(randomTetromino()); // 随机生成新方块
  setPosition({ row: 0, col: 5 }); // 初始位置
};
