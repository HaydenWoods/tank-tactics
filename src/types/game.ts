export enum GameStatus {
  SETUP = "setup",
  IN_PROGRESS = "inProgress",
  PAUSED = "paused",
  CANCELLED = "cancelled",
  FINISHED = "finished",
}

export interface BoardPositionBase {
  x: number;
  y: number;
}
export interface BoardPositionBlank extends BoardPositionBase {
  type: "blank";
}
export interface BoardPositionPlayer extends BoardPositionBase {
  type: "player";
  player: any; 
}
export type BoardPosition = BoardPositionBlank | BoardPositionPlayer;