import { GameStatus } from "@/types/game";
import { ICommand } from "@/types/command";

import { findPlayerByGameAndDiscordId } from "@/services/player";
import { buildPlayerInfoEmbed } from "@/helpers/messages";

export const info: ICommand = {
  data: {
    "name": "info",
    "description": "Show a player's info in the current Tank Tactics game.",
    "options": [
      {
        "type": 6,
        "name": "player",
        "description": "The player whos info to display",
        "required": true
      },
    ],
  },
  execute: async (interaction, { game, actionPlayer }) => {
    if (!game) {
      throw new Error("Game does not exist");
    }
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error("Game is not in progress");
    }
    if (!actionPlayer) {
      throw new Error("You do not exist in this game");
    }

    const targetDiscordUser = interaction.options.get("player")?.user;

    if (!targetDiscordUser) {
      throw new Error("No target player given");
    }

    const targetPlayer = await findPlayerByGameAndDiscordId({ 
      discordId: targetDiscordUser.id,
      gameId: game._id,
    });

    if (!targetPlayer) {
      throw new Error("Target player does not exist in this game");
    }

    const embed = buildPlayerInfoEmbed({ 
      player: targetPlayer,
      showPrivate: false,
    });

    await interaction.reply({ embeds: [embed] });
  },
};
