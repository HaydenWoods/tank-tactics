import pino from "pino";

import { Command, CommandController } from "@/types/command";

import { GameService } from "@/services/game";
import { GameStatus } from "@/types/game";
import { config } from "@/config";
import { UserService } from "@/services/user";
import { PlayerService } from "@/services/player";
import { buildBoardEmbed } from "@/helpers/messages";

const logger = pino();

export class GameController {
  static create: CommandController = async (
    interaction,
    { game, actionUser }
  ) => {
    const { channelId, guildId } = interaction;

    if (!guildId) {
      throw new Error("Game must be created within a server text channel");
    }

    if (game) {
      throw new Error("Game already exists within this text channel");
    }

    await GameService.create({
      guildId,
      channelId,
      user: actionUser,
    });

    await interaction.reply("Game has been created.");
  };

  static start: CommandController = async (
    interaction,
    { agenda, game, isGameOwner }
  ) => {
    if (!game) {
      throw new Error("Game doesn't exist in this channel");
    }

    if (!isGameOwner) {
      throw new Error("Must be game owner to start the game");
    }

    if (game.status !== GameStatus.SETUP) {
      throw new Error("Game is not in setup");
    }

    if (game.players.length < config.game.minimumPlayers) {
      throw new Error(
        `Game must have minimum of ${config.game.minimumPlayers} players to start`
      );
    }

    await GameService.start({ game, agenda });

    await interaction.reply("Game has been started");
  };

  static cancel: CommandController = async (
    interaction,
    { game, isGameOwner }
  ) => {
    if (!game) {
      throw new Error("Game does not exist");
    }

    if (!isGameOwner) {
      throw new Error("Only the game owner can cancel the game");
    }

    await GameService.cancel({ game });

    await interaction.reply("Game has been cancelled");
  };

  static join: CommandController = async (
    interaction,
    { game, actionUser }
  ) => {
    if (!game) {
      throw new Error("Game does not exist");
    }

    if (game.status !== GameStatus.SETUP) {
      throw new Error("Game is not in setup");
    }

    if (game.players.length >= config.game.maximumPlayers) {
      throw new Error(
        `Game has a maximum of ${config.game.maximumPlayers} players`
      );
    }

    if (interaction.user.bot) {
      throw new Error("Bots are unable to join");
    }

    const doesExist = await PlayerService.findPlayerByGameAndDiscordId({
      gameId: game._id,
      discordId: actionUser.discordId,
    });

    if (doesExist) {
      throw Error("You already exist in this game");
    }

    const emoji = interaction.options.get("emoji")?.value as string;

    await GameService.addPlayer({
      game,
      user: actionUser,
      emoji,
    });

    await interaction.reply(`${actionUser.username} has joined the game.`);
  };

  static leave: CommandController = async (
    interaction,
    { game, actionPlayer }
  ) => {
    if (!game) {
      throw new Error("Game doesn't exist in this channel");
    }

    if (game.status !== GameStatus.SETUP) {
      throw new Error("Game is not in setup");
    }

    if (!actionPlayer) {
      throw new Error("You do not exist in the game");
    }

    await GameService.removePlayer({ game, player: actionPlayer });

    await interaction.reply(`${actionPlayer.user.username} has left the game.`);
  };

  static addPlayer: CommandController = async (
    interaction,
    { game, isGameOwner, actionUser }
  ) => {
    if (!game) {
      throw new Error("Game does not exist");
    }

    if (!isGameOwner) {
      throw new Error("Must be game admin to add a player");
    }

    if (game.status !== GameStatus.SETUP) {
      throw new Error("Game is not in setup");
    }

    if (game.players.length >= config.game.maximumPlayers) {
      throw new Error(
        `Game has a maximum of ${config.game.maximumPlayers} players.`
      );
    }

    const targetDiscordUser = interaction.options.get("player")?.user;

    if (!targetDiscordUser) {
      throw new Error("No player to add");
    }

    if (targetDiscordUser.bot) {
      throw new Error("Unable to add a bot to the game");
    }

    const targetUser = await UserService.upsertUser({
      discordUser: targetDiscordUser,
    });

    const doesExist = await PlayerService.findPlayerByGameAndDiscordId({
      gameId: game._id,
      discordId: targetDiscordUser.id,
    });

    if (doesExist) {
      throw Error(`${targetUser.username} already exists in this game`);
    }

    const emoji = interaction.options.get("emoji")?.value as string;

    await GameService.addPlayer({
      game,
      user: targetUser,
      emoji,
    });

    await interaction.reply(
      `${actionUser.username} has added ${targetUser.username} to the game.`
    );
  };

  static removePlayer: CommandController = async (
    interaction,
    { game, isGameOwner, actionPlayer }
  ) => {
    if (!game) {
      throw new Error("Game doesn't exist in this channel");
    }

    if (!isGameOwner) {
      throw new Error("Must be game admin to remove a player");
    }

    if (game.status !== GameStatus.SETUP) {
      throw new Error("Game is not in setup");
    }

    if (!actionPlayer) {
      throw new Error("You do not exist in the game");
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

    await GameService.removePlayer({ game, player: targetPlayer });

    await interaction.reply(
      `${actionPlayer.user.username} has removed ${targetPlayer.user.username} from the game.`
    );
  };

  static displayBoard: CommandController = async (interaction, { game }) => {
    if (!game) {
      throw new Error("Game does not exist");
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error("Game is not in progress");
    }

    const embed = buildBoardEmbed({ game });

    interaction.reply({ embeds: [embed] });
  };
}
