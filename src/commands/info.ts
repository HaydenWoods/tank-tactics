import { GameStatus } from "@/types/game";
import { ICommand } from "@/types/command";

import { findPlayerByGameAndDiscordId, getPlayerInfo } from "@/services/player";
import { findGame } from "@/services/game";
import { buildPlayerInfoEmbed } from "@/helpers/messages";

export const info: ICommand = {
  data: {
    "name": "info",
    "description": "Show a player's info in the current Tank Tactics game.",
    "options": [
      {
        "type": 6,
        "name": "player",
        "description": "The player whos info to display",
        "required": true
      },
    ],
  },
  execute: async (interaction) => {
    const { channelId } = interaction;

    const actionDiscordUser = interaction.user;
    const targetDiscordUser = interaction.options.get("player")?.user;

    if (!targetDiscordUser) {
      throw new Error("No target player given");
    }

    const game = await findGame({ 
      channelId, 
      status: GameStatus.IN_PROGRESS 
    });

    if (!game) {
      throw new Error("Game does not exist");
    }
    
    const actionPlayer = await findPlayerByGameAndDiscordId({ 
      discordId: actionDiscordUser.id,
      gameId: game._id,
    });

    if (!actionPlayer) {
      throw new Error("You do not exist in this game");
    }

    const targetPlayer = await findPlayerByGameAndDiscordId({ 
      discordId: targetDiscordUser.id,
      gameId: game._id,
    });

    if (!targetPlayer) {
      throw new Error("Target player does not exist in this game");
    }

    const playerInfo = getPlayerInfo({ 
      actionPlayer,
      targetPlayer,
    });

    const embed = buildPlayerInfoEmbed({ 
      player: targetPlayer, 
      playerInfo 
    });

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
