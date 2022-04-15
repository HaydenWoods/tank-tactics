import { IPlayerDocument } from "@/models/player";

export enum GameStatus {
  SETUP = "setup",
  IN_PROGRESS = "inProgress",
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
  player: IPlayerDocument;
}
export type BoardPosition = BoardPositionBlank | BoardPositionPlayer;
