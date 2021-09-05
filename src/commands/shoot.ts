import { ICommand } from "@/types/command";
import { GameStatus } from "@/types/game";

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
      },
      {
        "type": 4,
        "name": "amount",
        "description": "The amount of times to shoot",
        "required": false
      },
    ]
  },
  execute: async (interaction, { game, actionPlayer }) => {
    if (!game) {
      throw new Error("Game in setup doesn't exist in this channel");
    }
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error("Game is not in progress");
    }
    if (!actionPlayer) {
      throw new Error("You do not exist within this game");
    }
    
    const targetDiscordUser = interaction.options.get("player")?.user;
    const amount = (interaction.options.get("amount")?.value || 1) as number;

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

    const { 
      actualAmount, 
      isNowDead, 
    } = await shootPlayer({ actionPlayer, targetPlayer, amount });
    
    await interaction.reply(`${actionPlayer.user.username} has shot ${targetPlayer.user.username} ${actualAmount > 1 ? `${actualAmount} times` : ""}`);

    if (isNowDead) {
      await interaction.followUp(`${targetPlayer.user.username} has died`);
      await interaction.followUp(`${actionPlayer.user.username} has been awarded all of ${targetPlayer.user.username}'s action points`);
    }
  },
};
