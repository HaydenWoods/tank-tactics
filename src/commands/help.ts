import { ICommand } from "@/types/command";

import { buildHelpEmbed } from "@/helpers/messages";

export const help: ICommand = {
  data: {
    "name": "help",
    "description": "Tank Tactics help.",
  },
  execute: async (interaction) => {
    const embed = buildHelpEmbed();

    await interaction.reply({ embeds: [embed] });
  },
};
