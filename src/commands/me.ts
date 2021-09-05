import { GameStatus } from "@/types/game";
import { ICommand } from "@/types/command";

import { buildPlayerInfoEmbed } from "@/helpers/messages";

export const me: ICommand = {
  data: {
    "name": "me",
    "description": "Show your player info for the current Tank Tactics game.",
  },
  execute: async (interaction, { game, actionPlayer }) => {
    if (!game) {
      throw new Error("Game does not exist");
    }
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error("Game does not exist");
    }
    if (!actionPlayer) {
      throw new Error("You do not exist in this game");
    }

    const embed = buildPlayerInfoEmbed({ 
      player: actionPlayer,
      showPrivate: true,
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
