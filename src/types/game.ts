export enum GameStatus {
  SETUP = "SETUP",
  IN_PROGRESS = "IN_PROGRESS",
  PAUSED = "PAUSED",
  CANCELLED = "CANCELLED",
  FINISHED = "FINISHED",
}

export interface BoardPositionBase {
  x: number;
  y: number;
  type: "blank" | "player";
}
export interface BoardPositionBlank extends BoardPositionBase {
  type: "blank";
}
export interface BoardPositionPlayer extends BoardPositionBase {
  type: "player";
  player: any; 
}
export type BoardPosition = BoardPositionBase | BoardPositionPlayer;