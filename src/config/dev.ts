import { Config } from "@/types/config";

export const config: Config = {
  bot: {
    token: "ODc4MjI1MjY3NjAzMTUyODk2.YR-FBA.YVttCjmewBO_XLd2REdRw_D91GE",
    color: "#82cf61",
  },
  game: {
    // Board
    xSize: 12,
    ySize: 8,

    // Players
    minimumPlayers: 1,
    maximumPlayers: 128,

    // Health
    maxHealth: 3,
    defaultHealth: 3,

    // Range
    defaultRange: 2,

    // Shop
    rangeCost: 3,
    healthCost: 3,
  },
};