import { EmbedField, MessageEmbed } from "discord.js";

import { config } from "@/config";

import { BLANK_EMOJI, FIELDS_PER_ROW, PLAYER_EMOJIS } from "@/constants/board";

import { IPlayerDocument } from "@/models/player";

import { getPlayerDescription } from "@/helpers/player";
import { getAllPositions, positionMatch } from "@/helpers/game";

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

export const buildBoardEmbed = ({
  players,
}: {
  players: IPlayerDocument[]
}) => {
  const boardFields: EmbedField[] = players.map((player, i) => {
    const emoji = PLAYER_EMOJIS[i];
    const name = `:${emoji}: ${player.user.username} `;
    const value = getPlayerDescription({ player });
    const inline = !((i + 1) % (FIELDS_PER_ROW + 1) === 0);

    return { name, value, inline };
  });

  const allPositions = getAllPositions({ 
    xSize: config.game.xSize,
    ySize: config.game.ySize,
  });

  const boardPositions = allPositions.map((position) => ({
    x: position.x,
    y: position.y,
    emoji: BLANK_EMOJI,
  }));

  players.forEach((player, i) => {
    const index = boardPositions.findIndex((position) => positionMatch(position, player.position));
    boardPositions[index].emoji = PLAYER_EMOJIS[i];
  });

  let boardDescription = boardPositions.reduce((boardDescription, boardPosition) => {
    const isNewLine = boardPosition.x === config.game.xSize;
    return `${boardDescription}:${boardPosition.emoji}:${isNewLine ? "\n" : ""}`;
  }, "");

  boardDescription = `${boardDescription}\n**Players**`;

  return new MessageEmbed()
    .setColor(config.bot.color)
    .setTitle("Board")
    .setDescription(boardDescription)
    .setFields(boardFields)
};

export const buildHelpEmbed = () => {
  return new MessageEmbed()
    .setColor(config.bot.color)
    .setTitle("Help")
    .setDescription("There will be help here in the future.");
};