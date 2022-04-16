import { EmbedField, MessageEmbed } from "discord.js";

import { config } from "@/config";

import { BLANK_EMOJI, FIELDS_PER_ROW } from "@/constants/board";

import { IPlayerDocument } from "@/models/player";

import { getPlayerDescription } from "@/helpers/player";
import { getAllPositions, positionMatch } from "@/helpers/game";
import { IGameDocument } from "@/models/game";

export const buildPlayerInfoEmbed = ({
  player,
  showPrivate,
}: {
  player: IPlayerDocument;
  showPrivate?: boolean;
}) => {
  const playerDescription = getPlayerDescription({
    player,
    showPrivate,
  });

  return new MessageEmbed()
    .setColor(config.bot.color)
    .setTitle(`${player.user.username}`)
    .setDescription(playerDescription);
};

export const buildBoardEmbed = ({ game }: { game: IGameDocument }) => {
  const boardFields: EmbedField[] = game.players.map((player, i) => {
    const name = `${player.emoji}  ${player.user.username} `;
    const value = getPlayerDescription({ player });

    return { name, value, inline: true };
  });

  const allPositions = getAllPositions({
    width: game.config.width,
    height: game.config.height,
  });

  const boardPositions = allPositions.map((position) => ({
    x: position.x,
    y: position.y,
    emoji: BLANK_EMOJI,
  }));

  game.players.forEach((player, i) => {
    const index = boardPositions.findIndex((position) =>
      positionMatch(position, player.position)
    );

    boardPositions[index].emoji = player.emoji;
  });

  let boardDescription = boardPositions.reduce(
    (boardDescription, boardPosition) => {
      const isNewLine = boardPosition.x === game.config.width;
      return `${boardDescription}${boardPosition.emoji}${
        isNewLine ? "\n" : ""
      }`;
    },
    ""
  );

  boardDescription = `${boardDescription}\n**Players**`;

  return new MessageEmbed()
    .setColor(config.bot.color)
    .setTitle("Board")
    .setDescription(boardDescription)
    .setFields(boardFields);
};

export const buildHelpEmbed = () => {
  return new MessageEmbed()
    .setColor(config.bot.color)
    .setTitle("Help")
    .setDescription("There will be help here in the future.");
};
