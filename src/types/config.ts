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

    intervals: {
      actionPoints: DateTimeUnit;
    };

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
