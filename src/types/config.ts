import { ColorResolvable } from "discord.js";

import { Item, ItemConfig } from "@/types/shop";

export interface Config {
  mongo: {
    url: string;
  };
  bot: {
    token?: string;
    applicationId?: string;
    color: ColorResolvable;
  };
  commands: {
    guildId?: string;
  };
  game: {
    // Board
    xSize: number;
    ySize: number;

    // Players
    minimumPlayers: number;
    maximumPlayers: number;

    // Health
    defaultHealth: number;

    // Range
    defaultRange: number;

    // Shop
    items: Partial<Record<Item, ItemConfig>>;
  };
}
