import { ICommand } from "@/types/command";
import { GameStatus } from "@/types/game";

import { removeGamePlayer } from "@/services/game";
import { findPlayerByGameAndDiscordId } from "@/services/player";

export const remove: ICommand = {
  data: {
    "name": "remove",
    "description": "Remove a player from the current Tank Tactics game.",
    "options": [
      {
        "type": 6,
        "name": "player",
        "description": "The player to remove",
        "required": true
      },
    ],
  },
  execute: async (interaction, { game, actionPlayer }) => {
    if (!game) {
      throw new Error("Game doesn't exist in this channel");
    }
    if (game.status !== GameStatus.SETUP) {
      throw new Error("Game is not in setup");
    }
    if (!actionPlayer) {
      throw new Error("You do not exist in the game");
    }

    const targetDiscordUser = interaction.options.get("player")?.user;

    if (!targetDiscordUser) {
      throw new Error("No target player given");
    }

    const targetPlayer = await findPlayerByGameAndDiscordId({
      gameId: game._id,
      discordId: targetDiscordUser.id,
    });

    if (!targetPlayer) {
      throw new Error("Target player does not exist within this game");
    }

    await removeGamePlayer({ game, player: targetPlayer });

    await interaction.reply(`${actionPlayer.user.username} has removed ${targetPlayer.user.username} from the game.`);
  },
};
