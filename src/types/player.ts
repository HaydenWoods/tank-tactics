export enum PlayerStatus {
  ALIVE = "ALIVE",
  DEAD = "DEAD",
  LEFT = "LEFT",
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