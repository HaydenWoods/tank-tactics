import { config } from "@/config";

import { ICommand } from "@/types/command";
import { GameStatus } from "@/types/game";

import { addGamePlayer } from "@/services/game";
import { createOrUpdateUser } from "@/services/user";
import { findPlayerByGameAndDiscordId } from "@/services/player";

export const add: ICommand = {
  data: {
    "name": "add",
    "description": "Add a new player to the Tank Tactics game.",
    "options": [
      {
        "type": 6,
        "name": "player",
        "description": "The player to add",
        "required": true
      }
    ]
  },
  execute: async (interaction, { game, isAdmin, actionUser }) => {
    if (!game) {
      throw new Error("Game does not exist");
    }
    if (!isAdmin) {
      throw new Error("Must be game admin to remove a player");
    }
    if (game.status !== GameStatus.SETUP) {
      throw new Error("Game is not in setup")
    }
    if (game.players.length >= config.game.maximumPlayers) {
      throw new Error(`Game has a maximum of ${config.game.maximumPlayers} players.`);
    }

    const targetDiscordUser = interaction.options.get("player")?.user;

    if (!targetDiscordUser) {
      throw new Error("No player to add");
    }
    if (targetDiscordUser.bot) {
      throw new Error("Unable to add a bot to the game");
    }

    const targetUser = await createOrUpdateUser({ discordUser: targetDiscordUser });
    const doesExist = await findPlayerByGameAndDiscordId({ 
      gameId: game._id, 
      discordId: targetDiscordUser.id 
    });

    if (doesExist) {
      throw Error(`${targetUser.username} already exists in this game`);
    }
    
    await addGamePlayer({
      game,
      user: targetUser,
    });

    await interaction.reply(`${actionUser.username} has added ${targetUser.username} to the game.`);
  },
};
