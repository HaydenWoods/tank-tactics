import { SlashCommandBuilder } from "@discordjs/builders";

import { GameStatus } from "@/types/game";
import { ICommand } from "@/types/command";
import { HistoryType } from "@/types/history";
import { findOrCreateUser } from "@/services/user";

import { addGameHistory, findGame, pauseGame } from "@/services/game";

export const pause: ICommand = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause"),
  execute: async (interaction) => {
    const { channelId } = interaction;
    const discordUser = interaction.user;
    
    const user = await findOrCreateUser({ discordUser });

    const game = await findGame({ 
      channelId, 
      status: GameStatus.IN_PROGRESS 
    });

    if (!game) {
      throw Error("Game in setup doesn't exist in this channel");
    }
    
    await pauseGame({ _id: game._id });

    await addGameHistory({ 
      _id: game._id,
      history: {
        type: HistoryType.PAUSE,
        user,
        game,
      }
    });

    await interaction.reply("Game has been paused");
  },
};
