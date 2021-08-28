import { EmbedField, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

import { config } from "@/config";

import { GameStatus } from "@/types/game";
import { ICommand } from "@/types/command";

import { findGameByStatusAndChannelId } from "@/services/game";

import { getBoardPositions } from "@/helpers/game";
import { Player } from "@/models/player";
import { User } from "@/models/user";

export const board: ICommand = {
  data: new SlashCommandBuilder()
    .setName("board")
    .setDescription("board"),
  execute: async (interaction) => {
    const { channelId } = interaction;

    const game = await findGameByStatusAndChannelId({
      channelId,
      statuses: [GameStatus.IN_PROGRESS],
    });;

    if (!game) {
      throw new Error("Game does not exist");
    }

    const { players } = game;
    
    const boardPositions = getBoardPositions({ 
      players, 
      xSize: config.game.xSize, 
      ySize: config.game.ySize 
    });

    const playerEmojis = [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "keycap_ten",
    ];

    let boardPositionMessage = "";
    let boardPositionFields: EmbedField[] = [];
    boardPositions.forEach((boardPosition) => {

      let message = "";

      switch (boardPosition.type) {
        case "blank":
          message += ":black_large_square:";
          break;
        case "player":
          const { player } = boardPosition;
          
          const emoji = playerEmojis[0];
          playerEmojis.splice(0, 1);
          message += `:${emoji}:`;

          if (player instanceof Player && player.user instanceof User) {
            boardPositionFields.push({ name: player.user.username, value: emoji, inline: true });
          }
          break;
      }

      if (boardPosition.x === config.game.xSize) {
        message += "\n";
      }

      boardPositionMessage += message;
    });

    const embed = new MessageEmbed()
			.setColor(config.bot.color)
      .setDescription(boardPositionMessage)
      .setFields(boardPositionFields)

    interaction.reply({ embeds: [embed] });
  },
};
