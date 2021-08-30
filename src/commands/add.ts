import { config } from "@/config";

import { ICommand } from "@/types/command";
import { GameStatus } from "@/types/game";
import { HistoryType } from "@/types/history";

import { addGameHistory, addGamePlayer, findGameByStatusAndChannelId } from "@/services/game";
import { findOrCreateUser } from "@/services/user";
import { findPlayer } from "@/services/player";

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
  execute: async (interaction) => {
    const { channelId } = interaction;

    const discordUser = interaction.options.get("player")?.user;

    if (!discordUser) {
      throw Error("No player to add");
    }
    if (discordUser.bot) {
      throw Error("Unable to add a bot to the game");
    }

    const game = await findGameByStatusAndChannelId({
      channelId,
      statuses: [GameStatus.SETUP],
    }, { lean: false });

    if (!game) {
      throw Error("Game does not exist");
    }

    if (game.players.length >= config.game.maximumPlayers) {
      throw Error(`Game has a maximum of ${config.game.maximumPlayers} players.`);
    }

    const commandUser = await findOrCreateUser({ discordUser });
    const addingUser = await findOrCreateUser({ discordUser });

    const doesExist = await findPlayer({ game, user: addingUser });

    if (doesExist) {
      throw Error(`${addingUser.username} already exists in this game`);
    }
    
    const player = await addGamePlayer({
      _id: game._id,
      userId: addingUser.id,
    });

    await addGameHistory({ 
      _id: game._id,
      history: { 
        type: HistoryType.ADD,
        user: commandUser,
        game,
        meta: {
          player: player._id,
        },
      },
    });

    await interaction.reply(`${addingUser.username} has been added to the game.`);
  },
};
