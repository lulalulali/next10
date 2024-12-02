// utils/gameLogic.ts
// 定义 Tetromino 类型
export interface Tetromino {
  shape: number[][]; // 方块的形状
}
// 方块形状的定义
export const TETROMINOS: Record<string, Tetromino> = {
  I: { shape: [[1, 1, 1, 1]] },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
};

// 随机生成一个方块
export const randomTetromino = (): Tetromino => {
  const randomShape =
    Object.values(TETROMINOS)[
      Math.floor(Math.random() * Object.values(TETROMINOS).length)
    ];
  return randomShape; // 确保返回一个形如 { shape: [...] } 的对象
};

// 创建初始空网格
export const createGrid = (rows: number = 20, cols: number = 10) =>
  Array.from({ length: rows }, () => Array(cols).fill(0));

// 检查方块是否可以在给定位置合法移动
export const isValidMove = (
  grid: number[][],
  piece: Tetromino, // 使用 Tetromino 类型
  position: { row: number; col: number }
): boolean => {
  // 这里使用 piece.shape 来访问方块的形状
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) {
        const newRow = position.row + r;
        const newCol = position.col + c;

        // 检查是否超出底部边界
        if (newRow >= grid.length || newCol < 0 || newCol >= grid[0].length) {
          return false;
        }

        // 检查是否与已存在的方块重叠
        if (grid[newRow][newCol] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
};

// 将方块合并到网格中
export const mergePiece = (
  grid: number[][],
  piece: number[][],
  position: { row: number; col: number }
): number[][] => {
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

// 方块的下落逻辑
export const movePiece = (
  grid: number[][],
  piece: Tetromino, // 使用 Tetromino 类型
  position: { row: number; col: number },
  rowOffset: number,
  colOffset: number
) => {
  const newPosition = {
    row: position.row + rowOffset,
    col: position.col + colOffset,
  };

  // 使用 piece.shape 来访问方块的形状
  if (isValidMove(grid, piece, newPosition)) {
    return { position: newPosition, newGrid: grid }; // 保证返回 newGrid 和 position
  } else if (rowOffset === 1) {
    // 如果方块已到达底部，合并到网格并生成新的方块
    const newGrid = mergePiece(grid, piece.shape, position); // 使用 piece.shape
    return {
      position: { row: 0, col: Math.floor(grid[0].length / 2) },
      newGrid,
    };
  }
  return { position, newGrid: grid };
};

// 旋转方块
export const rotatePiece = (piece: number[][]): number[][] => {
  return piece[0].map((_, index) => piece.map((row) => row[index]).reverse());
};

// 重新开始游戏（例如，初始化网格和方块）
export const startGame = () => {
  return {
    grid: createGrid(),
    piece: randomTetromino(),
    position: { row: 0, col: 5 },
  };
};

// 重置游戏
export const resetGame = () => {
  return {
    grid: createGrid(),
    piece: randomTetromino(),
    position: { row: 0, col: 5 },
  };
};
