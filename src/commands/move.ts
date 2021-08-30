import { GameStatus } from "@/types/game";
import { ICommand } from "@/types/command";

import { findGame } from "@/services/game";
import { findPlayerByGameAndDiscordId } from "@/services/player";

export const shoot: ICommand = {
  data: {
    "name": "move",
    "description": "Move your player in the current Tank Tactics game.",
    "options": [
      {
        "type": 4,
        "name": "x",
        "description": "The x position to move to",
        "required": true
      },
      {
        "type": 4,
        "name": "y",
        "description": "The y position to move to",
        "required": true
      }
    ]
  },
  execute: async (interaction) => {
    const { channelId } = interaction;

    const actionDiscordUser = interaction.user;

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

    // await shootPlayer({ actionPlayer, targetPlayer });
    
    // await interaction.reply(`${actionPlayer.user.username} has shot ${targetPlayer.user.username}`);
  },
};
