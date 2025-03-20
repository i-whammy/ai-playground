export enum CellValue {
  NONE = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  BOMB = 9
}

export enum CellState {
  HIDDEN,
  VISIBLE,
  FLAGGED
}

export type Cell = {
  value: CellValue;
  state: CellState;
  red?: boolean;
};

export type Board = Cell[][];

export enum Face {
  SMILE = "😊",
  OH = "😮",
  LOST = "😵",
  WON = "😎"
}

export type GameStatus = "playing" | "won" | "lost";

export interface GameState {
  board: Board;
  face: Face;
  time: number;
  bombCounter: number;
  status: GameStatus;
}