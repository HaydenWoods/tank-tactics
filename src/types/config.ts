import { ColorResolvable } from "discord.js";

export interface Config {
  bot: {
    token?: string;
    color: ColorResolvable;
  };
  game: {
    // Board
    xSize: number;
    ySize: number;

    // Players
    minimumPlayers: number;
    maximumPlayers: number;

    // Health
    maxHealth: number;
    defaultHealth: number;

    // Range
    defaultRange: number;

    // Shop
    rangeCost: number;
    healthCost: number;
  };
}
