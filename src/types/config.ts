import { DateTimeUnit } from "luxon";
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
    board: {
      cellsPerPlayer: number;
      ratio: number;
      ratioOffset: number;
    };

    iterationInterval: DateTimeUnit;

    // Players
    minimumPlayers: number;
    maximumPlayers: number;

    // Health
    initialHealth: number;

    // Range
    initialRange: number;

    // Shop
    items: Partial<Record<Item, ItemConfig>>;
  };
}
