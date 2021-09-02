import { ICommand } from "@/types/command";

import { cancelGame } from "@/services/game";

export const cancel: ICommand = {
  data: {
    "name": "cancel",
    "description": "Cancel the current Tank Tactics game.",
  },
  execute: async (interaction, { game }) => {
    if (!game) {
      throw new Error("Game does not exist");
    }

    await cancelGame({ game });

    await interaction.reply("Tank Tactics game has been cancelled");
  },
};
