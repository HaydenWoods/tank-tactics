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

export enum Items {
  ACTION_POINTS = "actionPoints",
  RANGE = "range",
  HEALTH = "health",
}

export type PlayerInfo = {
  title: string;
  value: string;
}[];