import { ICommand } from "@/types/command";
import { GameStatus } from "@/types/game";

import { buildBoardEmbed } from "@/helpers/messages";

export const board: ICommand = {
  data: {
    "name": "board",
    "description": "Show the current board for the Tank Tactics game.",
  },
  execute: async (interaction, { game }) => {
    if (!game) {
      throw new Error("Game does not exist");
    }
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error("Game is not in progress");
    }

    const { players } = game;
    
    const embed = buildBoardEmbed({ players });

    interaction.reply({ embeds: [embed] });
  },
};
