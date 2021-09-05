export enum PlayerStatus {
  ALIVE = "alive",
  DEAD = "dead",
  REMOVED = "removed",
}

export enum Direction {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
} 

export type PlayerInfo = {
  title: string;
  value: string;
}[];