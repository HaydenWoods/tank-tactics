import { ICommand } from "@/types/command";
import { GameStatus } from "@/types/game";

import { pauseGame } from "@/services/game";

export const pause: ICommand = {
  data: {
    "name": "pause",
    "description": "Pause the current Tank Tactics game.",
  },
  execute: async (interaction, { game }) => {
    if (!game) {
      throw new Error("Game does not exist");
    }
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error("Game is not in progress");
    }
    
    await pauseGame({ game });

    await interaction.reply("Game has been paused");
  },
};
