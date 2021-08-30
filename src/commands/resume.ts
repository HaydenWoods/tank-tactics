import { SlashCommandBuilder } from "@discordjs/builders";

import { GameStatus } from "@/types/game";
import { ICommand } from "@/types/command";
import { HistoryType } from "@/types/history";

import { addGameHistory, findGame, resumeGame } from "@/services/game";
import { findOrCreateUser } from "@/services/user";

export const resume: ICommand = {
  data: {
    "name": "resume",
    "description": "Resume the current Tank Tactics game.",
  },
  execute: async (interaction) => {
    const { channelId } = interaction;
    const discordUser = interaction.user;
    
    const user = await findOrCreateUser({ discordUser });

    const game = await findGame({ 
      channelId, 
      status: GameStatus.PAUSED 
    });
    
    if (!game) {
      throw Error("Game in setup doesn't exist in this channel");
    }

    await resumeGame({ _id: game._id });

    await addGameHistory({ 
      _id: game._id,
      history: {
        type: HistoryType.RESUME,
        user,
        game,
      }
    });

    await interaction.reply("Game has been resumed");
  },
};
