import { Config } from "@/types/config";

export const config: Config = {
  mongo: {
    url: "mongodb://localhost:27017",
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
    maxHealth: 3,
    defaultHealth: 3,

    // Range
    defaultRange: 2,

    // Shop
    rangeCost: 3,
    healthCost: 3,
  },
};