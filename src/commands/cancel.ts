import { SlashCommandBuilder } from "@discordjs/builders";

import { GameStatus } from "@/types/game";
import { ICommand } from "@/types/command";
import { HistoryType } from "@/types/history";

import { addGameHistory, cancelGame, findGameByStatusAndChannelId } from "@/services/game";
import { findOrCreateUser } from "@/services/user";

export const cancel: ICommand = {
  data: {
    "name": "cancel",
    "description": "Cancel the current Tank Tactics game.",
  },
  execute: async (interaction) => {
    const { channelId } = interaction;
    const discordUser = interaction.user;
    
    const user = await findOrCreateUser({ discordUser });

    const game = await findGameByStatusAndChannelId({
      channelId,
      statuses: [
        GameStatus.IN_PROGRESS, 
        GameStatus.SETUP, 
        GameStatus.PAUSED
      ],
    }, { lean: false });

    if (!game) {
      throw new Error("Game does not exist");
    }

    await cancelGame({ _id: game._id });

    await addGameHistory({ 
      _id: game._id,
      history: {
        type: HistoryType.CANCEL,
        user,
        game,
      }
    });

    await interaction.reply("Game has been cancelled");
  },
};
