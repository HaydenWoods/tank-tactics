import { ICommand } from "@/types/command";
import { GameStatus } from "@/types/game";
import { Items } from "@/types/player";

import { 
  findPlayerByGameAndDiscordId, 
  givePlayerActionPoints, 
  givePlayerHealth,
} from "@/services/player";

export const give: ICommand = {
  data: {
    "name": "give",
    "description": "Give another player an item in the current Tank Tactics game.",
    "options": [
      {
        "type": 6,
        "name": "player",
        "description": "The player to give the item to",
        "required": true
      },
      {
        "type": 3,
        "name": "item",
        "description": "The item to give",
        "choices": [
          {
            "name": "Action points",
            "value": "actionPoints"
          },
          {
            "name": "Health",
            "value": "health"
          },
        ],
        "required": true
      },
      {
        "type": 4,
        "name": "amount",
        "description": "The amount of that item to give",
        "required": true
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

    const item = interaction.options.get("item")?.value as Items;
    const amount = interaction.options.get("amount")?.value as number;

    const parameters = {
      actionPlayer,
      targetPlayer,
      amount,
    };

    if (item === Items.ACTION_POINTS) {
      await givePlayerActionPoints(parameters);
      await interaction.reply(`${actionPlayer.user.username} has given ${targetPlayer.user.username} ${amount} action points`);
    } else if (item === Items.HEALTH) {
      const { 
        isActionPlayerDead,
        isTargetPlayerAlive,
      } = await givePlayerHealth(parameters);

      await interaction.reply(`${actionPlayer.user.username} has given ${targetPlayer.user.username} ${amount} health`);

      if (isActionPlayerDead) {
        await interaction.followUp(`${actionPlayer.user.username} has died`);
      }
      if (isTargetPlayerAlive) {
        await interaction.followUp(`${targetPlayer.user.username} has been revived`);
      }
    }
  },
};
