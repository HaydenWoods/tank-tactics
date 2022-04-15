import { buildHelpEmbed } from "@/helpers/messages";
import { CommandController } from "@/types/command";

export class BotController {
  static displayHelp: CommandController = async (interaction) => {
    const embed = buildHelpEmbed();

    await interaction.reply({ embeds: [embed] });
  };
}
