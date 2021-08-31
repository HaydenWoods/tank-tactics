import { MessageEmbed } from "discord.js";

import { config } from "@/config";

import { PlayerInfo } from "@/types/player";
import { IPlayerDocument } from "@/models/player";

export const buildPlayerInfoEmbed = ({ 
  player, 
  playerInfo,
}: { 
  player: IPlayerDocument;
  playerInfo: PlayerInfo;
}) => {
  return new MessageEmbed()
    .setColor(config.bot.color)
    .setTitle(`${player.user.username}`)
    .setDescription(playerInfo.map((item) => `${item.title} ${item.value}`).join("\n"));
};