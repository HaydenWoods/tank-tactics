import { Config } from "@/types/config";

export const config: Config = {
  mongo: {
    url: "mongodb://mongo:27017",
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
    board: {
      cellsPerPlayer: 9,
      ratio: 1.33,
      ratioOffset: 0.17,
    },

    iterationInterval: "minute",

    intervals: {
      actionPoints: "minute",
    },

    // Players
    minimumPlayers: 2,
    maximumPlayers: 96,

    // Health
    initialHealth: 3,

    // Range
    initialRange: 2,

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
