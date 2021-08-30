import { GameStatus } from "@/types/game";
import { ICommand } from "@/types/command";

import { findGame } from "@/services/game";
import { findPlayerByGameAndDiscordId, shootPlayer } from "@/services/player";

export const shoot: ICommand = {
  data: {
    "name": "shoot",
    "description": "Shoot a player in the current Tank Tactics game.",
    "options": [
      {
        "type": 6,
        "name": "player",
        "description": "The player to shoot",
        "required": true
      }
    ]
  },
  execute: async (interaction) => {
    const { channelId } = interaction;

    const actionDiscordUser = interaction.user;
    const targetDiscordUser = interaction.options.get("player")?.user;

    if (!targetDiscordUser) {
      throw new Error("No target player given");
    }

    const game = await findGame({ 
      channelId, 
      status: GameStatus.IN_PROGRESS 
    });

    if (!game) {
      throw new Error("Game in setup doesn't exist in this channel");
    }

    const actionPlayer = await findPlayerByGameAndDiscordId({
      gameId: game._id,
      discordId: actionDiscordUser.id,
    });

    if (!actionPlayer) {
      throw new Error("You do not exist within this game");
    }

    const targetPlayer = await findPlayerByGameAndDiscordId({
      gameId: game._id,
      discordId: targetDiscordUser.id,
    });

    if (!targetPlayer) {
      throw new Error("Target player does not exist within this game");
    }

    await shootPlayer({ actionPlayer, targetPlayer });
    
    await interaction.reply(`${actionPlayer.user.username} has shot ${targetPlayer.user.username}`);
  },
};
