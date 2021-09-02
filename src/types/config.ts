import { ColorResolvable } from "discord.js";

export interface Config {
  mongo: {
    url: string;
  },
  bot: {
    token?: string;
    applicationId?: string;
    color: ColorResolvable;
  };
  commands: {
    guildId?: string;
  },
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
