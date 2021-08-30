import { SlashCommandBuilder } from "@discordjs/builders";

import { GameStatus } from "@/types/game";
import { ICommand } from "@/types/command";
import { HistoryType } from "@/types/history";

import { Game } from "@/models/game";

import { addGameHistory, findGameByStatusAndChannelId } from "@/services/game";
import { findOrCreateUser } from "@/services/user";

export const create: ICommand = {
  data: {
    "name": "create",
    "description": "Create a new Tank Tactics game.",
  },
  execute: async (interaction) => {
    const { guildId, channelId } = interaction;
    const discordUser = interaction.user;

    const doesExist = await findGameByStatusAndChannelId({
      channelId,
      statuses: [GameStatus.IN_PROGRESS, GameStatus.PAUSED],
    });

    if (doesExist) {
      throw new Error("Game exists in this channel already");
    }

    const user = await findOrCreateUser({ discordUser });

    const game = await Game.create({
      guildId,
      channelId,
      user,
    });

    await addGameHistory({ 
      _id: game._id, 
      history: { 
        type: HistoryType.CREATE,
        user,
        game,
      },
    });

    await interaction.reply("Game has been created");
  },
};
