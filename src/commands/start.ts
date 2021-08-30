import { SlashCommandBuilder } from "@discordjs/builders";

import { config } from "@/config";

import { GameStatus } from "@/types/game";
import { HistoryType } from "@/types/history";
import { ICommand } from "@/types/command";

import { addGameHistory, findGame, startGame } from "@/services/game";
import { findOrCreateUser } from "@/services/user";

export const start: ICommand = {
  data: {
    "name": "start",
    "description": "Start the current Tank Tactics game.",
  },
  execute: async (interaction) => {
    const { channelId } = interaction;
    const discordUser = interaction.user;
    
    const game = await findGame({ 
      channelId, 
      status: GameStatus.SETUP 
    });

    if (!game) {
      throw Error("Game in setup doesn't exist in this channel");
    }
    if (game.players.length < config.game.minimumPlayers) {
      throw Error(`Game must have minimum ${config.game.minimumPlayers} players to start.`);
    }

    const user = await findOrCreateUser({ discordUser });

    await startGame({ _id: game._id });

    await addGameHistory({ 
      _id: game._id, 
      history: { 
        type: HistoryType.START,
        user,
        game,
      },
    });

    await interaction.reply("Game has been started");
  },
};
