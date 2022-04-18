import {
  MessageActionRow,
  MessageButton,
  MessageButtonStyle,
} from "discord.js";

import { CommandController } from "@/types/command";
import { GameStatus } from "@/types/game";
import { Direction, PlayerStatus } from "@/types/player";
import { Item } from "@/types/shop";

import { PlayerService } from "@/services/player";

import { buildPlayerInfoEmbed } from "@/helpers/messages";

export class PlayerController {
  static move: CommandController = async (
    interaction,
    { game, actionPlayer }
  ) => {
    if (!game) {
      throw new Error("Game does not exist");
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error("Game is not in progress");
    }

    if (!actionPlayer) {
      throw new Error("You do not exist within this game");
    }

    const type = interaction.options.getSubcommand() as string;

    if (type === "direction") {
      const direction = interaction.options.get("direction")
        ?.value as Direction;
      const amount = (interaction.options.get("amount")?.value || 1) as number;

      await PlayerService.moveDirection({
        actionPlayer,
        game,
        direction,
        amount,
      });

      await interaction.reply(
        `${actionPlayer.emoji}<@${actionPlayer.user.discordId}> has moved ${direction} ${amount} times`
      );
    } else if (type === "coordinates") {
      const x = interaction.options.get("x")?.value as number;
      const y = interaction.options.get("y")?.value as number;

      await PlayerService.moveCoordinates({
        actionPlayer,
        game,
        x,
        y,
      });

      await interaction.reply(
        `${actionPlayer.emoji}<@${actionPlayer.user.discordId}> has move to position ${x}, ${y}`
      );
    }
  };

  static shoot: CommandController = async (
    interaction,
    { game, actionPlayer }
  ) => {
    if (!game) {
      throw new Error("Game in setup doesn't exist in this channel");
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error("Game is not in progress");
    }

    if (!actionPlayer) {
      throw new Error("You do not exist within this game");
    }

    const targetDiscordUser = interaction.options.get("player")?.user;
    const amount = (interaction.options.get("amount")?.value || 1) as number;

    if (!targetDiscordUser) {
      throw new Error("No target player given");
    }

    const targetPlayer = await PlayerService.findPlayerByGameAndDiscordId({
      gameId: game._id,
      discordId: targetDiscordUser.id,
    });

    if (!targetPlayer) {
      throw new Error("Target player does not exist within this game");
    }

    const { actualAmount, isNowDead } = await PlayerService.shootPlayer({
      actionPlayer,
      targetPlayer,
      amount,
    });

    await interaction.reply(
      `${actionPlayer.emoji}<@${actionPlayer.user.discordId}> has shot ${
        targetPlayer.emoji
      }<@${targetPlayer.user.discordId}> ${
        actualAmount > 1 ? `${actualAmount} times` : ""
      }`
    );

    if (isNowDead) {
      await interaction.followUp(
        `${targetPlayer.emoji}<@${targetPlayer.user.discordId}> has died`
      );
      await interaction.followUp(
        `${actionPlayer.emoji}<@${actionPlayer.user.discordId}> has been awarded all of ${targetPlayer.emoji}<@${targetPlayer.user.discordId}>'s action points`
      );
    }
  };

  static give: CommandController = async (
    interaction,
    { game, actionPlayer }
  ) => {
    if (!game) {
      throw new Error("Game does not exist");
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error("Game is not in progress");
    }

    if (!actionPlayer) {
      throw new Error("You do not exist within this game");
    }

    const targetDiscordUser = interaction.options.get("player")?.user;

    if (!targetDiscordUser) {
      throw new Error("No target player given");
    }

    const targetPlayer = await PlayerService.findPlayerByGameAndDiscordId({
      gameId: game._id,
      discordId: targetDiscordUser.id,
    });

    if (!targetPlayer) {
      throw new Error("Target player does not exist within this game");
    }

    const item = interaction.options.get("item")?.value as Item;
    const amount = interaction.options.get("amount")?.value as number;

    const parameters = {
      actionPlayer,
      targetPlayer,
      amount,
    };

    if (item === Item.ACTION_POINTS) {
      await PlayerService.giveActionPoints(parameters);
      await interaction.reply(
        `${actionPlayer.emoji}<@${actionPlayer.user.discordId}> has given ${targetPlayer.emoji}<@${targetPlayer.user.discordId}> ${amount} action points`
      );
    } else if (item === Item.HEALTH) {
      const { isActionPlayerDead, isTargetPlayerAlive } =
        await PlayerService.giveHealth(parameters);

      await interaction.reply(
        `${actionPlayer.emoji}<@${actionPlayer.user.discordId}> has given ${targetPlayer.emoji}<@${targetPlayer.user.discordId}> ${amount} health`
      );

      if (isActionPlayerDead) {
        await interaction.followUp(
          `${actionPlayer.emoji}<@${actionPlayer.user.discordId}> has died`
        );
      }

      if (isTargetPlayerAlive) {
        await interaction.followUp(
          `${targetPlayer.emoji}<@${targetPlayer.user.discordId}> has been revived`
        );
      }
    }
  };

  static buy: CommandController = async (
    interaction,
    { game, actionPlayer }
  ) => {
    if (!game) {
      throw new Error("Game does not exist");
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error("Game is not in progress");
    }

    if (!actionPlayer) {
      throw new Error("You do not exist within this game");
    }

    const item = interaction.options.get("item")?.value as Item;
    const amount = (interaction.options.get("amount")?.value || 1) as number;

    await PlayerService.buyItem({ player: actionPlayer, item, amount });

    interaction.reply(
      `${actionPlayer.emoji}<@${actionPlayer.user.discordId}> has bought ${amount} ${item}`
    );
  };

  static displayMe: CommandController = async (
    interaction,
    { game, actionPlayer }
  ) => {
    if (!game) {
      throw new Error("Game does not exist");
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error("Game does not exist");
    }

    if (!actionPlayer) {
      throw new Error("You do not exist in this game");
    }

    const embed = buildPlayerInfoEmbed({
      player: actionPlayer,
      showPrivate: true,
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  };

  static displayInfo: CommandController = async (
    interaction,
    { game, actionPlayer }
  ) => {
    if (!game) {
      throw new Error("Game does not exist");
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error("Game is not in progress");
    }

    if (!actionPlayer) {
      throw new Error("You do not exist in this game");
    }

    const targetDiscordUser = interaction.options.get("player")?.user;

    if (!targetDiscordUser) {
      throw new Error("No target player given");
    }

    const targetPlayer = await PlayerService.findPlayerByGameAndDiscordId({
      discordId: targetDiscordUser.id,
      gameId: game._id,
    });

    if (!targetPlayer) {
      throw new Error("Target player does not exist in this game");
    }

    const embed = buildPlayerInfoEmbed({
      player: targetPlayer,
      showPrivate: false,
    });

    // const row = new MessageActionRow().addComponents(
    //   new MessageButton()
    //     .setCustomId("shoot")
    //     .setLabel("Shoot")
    //     .setStyle("DANGER")
    // );

    await interaction.reply({
      embeds: [embed],
      // components: [row],
    });
  };

  static vote: CommandController = async (
    interaction,
    { game, actionPlayer }
  ) => {
    if (!game) {
      throw new Error("Game does not exist");
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error("Game is not in progress");
    }

    if (!actionPlayer) {
      throw new Error("You do not exist in this game");
    }

    if (actionPlayer.status !== PlayerStatus.DEAD) {
      throw new Error("Ineligble to vote as you are not dead");
    }

    const targetDiscordUser = interaction.options.get("player")?.user;

    if (!targetDiscordUser) {
      throw new Error("No target player given");
    }

    const targetPlayer = await PlayerService.findPlayerByGameAndDiscordId({
      discordId: targetDiscordUser.id,
      gameId: game._id,
    });

    if (!targetPlayer) {
      throw new Error("Target player does not exist in this game");
    }

    if (targetPlayer.status !== PlayerStatus.ALIVE) {
      throw new Error("Unable to vote for a player who not alive");
    }

    await PlayerService.vote({
      game,
      actionPlayer: actionPlayer,
      targetPlayer: targetPlayer,
    });

    await interaction.reply({
      content: `You have voted for ${targetPlayer.emoji}<@${targetPlayer.user.discordId}>`,
      ephemeral: true,
    });
  };
}
