import { ICommand } from "@/types/command";

import { addGamePlayer, createGame } from "@/services/game";

export const create: ICommand = {
  data: {
    "name": "create",
    "description": "Create a new Tank Tactics game.",
  },
  execute: async (interaction, { actionUser, game }) => {
    const { channelId, guildId } = interaction;

    if (!guildId) {
      throw new Error("Game must be created within a guild ");
    }
    if (game) {
      throw new Error("Game exists in this channel already");
    }

    const createdGame = await createGame({
      guildId,
      channelId,
      user: actionUser,
    });

    await interaction.reply(`A new Tank Tactics game has been created.`);

    await addGamePlayer({
      game: createdGame,
      user: actionUser,
    });

    await interaction.followUp(`${actionUser.username} was added to the game.`);
  },
};
