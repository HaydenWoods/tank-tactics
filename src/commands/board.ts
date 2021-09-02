import { EmbedField, MessageEmbed } from "discord.js";

import { config } from "@/config";

import { GameStatus } from "@/types/game";
import { ICommand } from "@/types/command";

import { findGameByStatusAndChannelId } from "@/services/game";

import { getBoardPositions } from "@/helpers/game";
import { Player } from "@/models/player";
import { User } from "@/models/user";

export const board: ICommand = {
  data: {
    "name": "board",
    "description": "Show the current board for the Tank Tactics game.",
  },
  execute: async (interaction, { game }) => {
    if (!game) {
      throw new Error("Game does not exist");
    }
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error("Game is not in progress");
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
            boardPositionFields.push({ name: `:${emoji}:`, value: `${player.user.username}`, inline: true });
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
