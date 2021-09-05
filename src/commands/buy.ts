import { buyItem } from "@/services/player";
import { ICommand } from "@/types/command";
import { GameStatus } from "@/types/game";
import { Items } from "@/types/shop";

export const buy: ICommand = {
  data: {
    "name": "buy",
    "description": "Buy an item or upgrade in the current Tank Tactics game.",
    "options": [
      {
        "type": 3,
        "name": "item",
        "description": "The item to buy",
        "choices": [
          {
            "name": "Range",
            "value": "range"
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
        "description": "The amount of that item to buy",
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
      throw new Error("You do not exist within this game");
    }

    const item = interaction.options.get("item")?.value as Items;
    const amount = (interaction.options.get("amount")?.value || 1) as number;

    await buyItem({ player: actionPlayer, item, amount });

    interaction.reply(`${actionPlayer.user.username} has bought ${amount} ${item}`);
  },
};
