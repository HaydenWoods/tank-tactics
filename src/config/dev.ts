import { Config } from "@/types/config";

export const config: Config = {
  mongo: {
    url: "mongodb://mongo:27017/tank-tactics",
  },
  bot: {
    token: process.env.BOT_TOKEN,
    applicationId: process.env.APPLICATION_ID,
    color: "#82cf61",
  },
  commands: {
    guildId: process.env.GUILD_ID,
  },
  game: {
    // Board
    xSize: 12,
    ySize: 8,

    // Players
    minimumPlayers: 1,
    maximumPlayers: 96,

    // Health
    defaultHealth: 3,

    // Range
    defaultRange: 2,

    // Shop
    items: {
      range: {
        price: 3,
      },
      health: {
        price: 3,
      },
    },
  },
};
