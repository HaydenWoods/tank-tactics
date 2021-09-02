import { ICommand } from "@/types/command";
import { GameStatus } from "@/types/game";

import { resumeGame } from "@/services/game";

export const resume: ICommand = {
  data: {
    "name": "resume",
    "description": "Resume the current Tank Tactics game.",
  },
  execute: async (interaction, { game }) => {
    if (!game) {
      throw new Error("Game does not exist");
    }
    if (game.status !== GameStatus.PAUSED) {
      throw new Error("Game is not paused");
    }

    await resumeGame({ game });

    await interaction.reply("Game has been resumed");
  },
};
