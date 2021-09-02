import { GameStatus } from "@/types/game";
import { ICommand } from "@/types/command";
import { Direction } from "@/types/player";

import { findGameByStatusAndChannelId } from "@/services/game";
import { findPlayerByGameAndDiscordId, movePlayerDirection } from "@/services/player";

export const move: ICommand = {
  data: {
    "name": "move",
    "description": "Move your player in the current Tank Tactics game.",
    "options": [
      {
        "type": 3,
        "name": "direction",
        "description": "The direction to move",
        "choices": [
          {
            "name": "up",
            "value": "up"
          },
          {
            "name": "down",
            "value": "down"
          },
          {
            "name": "left",
            "value": "left"
          },
          {
            "name": "right",
            "value": "right"
          }
        ],
        "required": true
      },
      {
        "type": 4,
        "name": "amount",
        "description": "The amount in that direction to move"
      }
    ]
  },
  execute: async (interaction, { game, actionPlayer }) => {
    if (!game) {
      throw new Error("Game does not exist");
    }
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error("Game is not in progress");
    }
    if (!actionPlayer) {
      throw new Error("You do not exist within this game");
    }

    const direction = interaction.options.get("direction")?.value as Direction;
    const amount = (interaction.options.get("amount")?.value || 1) as number;

    await movePlayerDirection({ 
      actionPlayer, 
      game, 
      direction, 
      amount 
    });
    
    await interaction.reply(`${actionPlayer.user.username} has moved ${direction} ${amount} times`);
  },
};
