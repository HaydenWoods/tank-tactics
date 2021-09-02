import { config } from "@/config";

import { GameStatus } from "@/types/game";
import { ICommand } from "@/types/command";

import { findGame, startGame } from "@/services/game";
import { createOrUpdateUser } from "@/services/user";

export const start: ICommand = {
  data: {
    "name": "start",
    "description": "Start the current Tank Tactics game.",
  },
  execute: async (interaction, { game }) => {
    if (!game) {
      throw new Error("Game in setup doesn't exist in this channel");
    }
    if (game.status !== GameStatus.SETUP) {
      throw new Error("Game is not in setup");
    }
    if (game.players.length < config.game.minimumPlayers) {
      throw new Error(`Game must have minimum ${config.game.minimumPlayers} players to start.`);
    }

    await startGame({ game });

    await interaction.reply("Game has been started");
  },
};
