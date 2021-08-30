import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

import { config } from "@/config";

import { GameStatus } from "@/types/game";
import { ICommand } from "@/types/command";

import { findPlayerByGameAndDiscordId } from "@/services/player";
import { findGameByStatusAndChannelId } from "@/services/game";

export const me: ICommand = {
  data: {
    "name": "me",
    "description": "Show your player info for the current Tank Tactics game.",
  },
  execute: async (interaction) => {
    const { channelId } = interaction;
    const discordUser = interaction.user;

    const game = await findGameByStatusAndChannelId({
      channelId,
      statuses: [GameStatus.IN_PROGRESS],
    });;

    if (!game) {
      throw new Error("Game does not exist");
    }
    
    const player = await findPlayerByGameAndDiscordId({ 
      discordId: discordUser.id,
      gameId: game._id,
    });

    if (!player) {
      throw new Error("You do not exist in this game");
    }

    const embed = new MessageEmbed()
			.setColor(config.bot.color)
			.setTitle(`${player.user.username}`)
      .setDescription(`
        :heart:   **${player.health}** hearts
        :compass:   **${player.range}** range
        :gem:   **${player.actionPoints}** action points
      `)

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
