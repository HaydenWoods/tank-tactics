import mongoose from "mongoose";
import pino from "pino";
import { Client } from "discord.js";

import { config } from "@/config";
import { commands } from "@/commands";

import { GameStatus } from "@/types/game";

import { GameService } from "@/services/game";
import { PlayerService } from "@/services/player";
import { UserService } from "@/services/user";

const logger = pino();

mongoose.connect(
  config.mongo.url,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (error) => {
    if (error) {
      logger.error("Database failed to connect", error);
      return;
    }

    logger.info("Database connected");
  }
);

export const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
  partials: ["CHANNEL"],
});

client.once("ready", () => {
  logger.info("Bot has started");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  try {
    const command = commands.find(
      (command) => command.meta.name === commandName
    );

    if (!command) {
      throw new Error("Command does not exist");
    }

    const { channelId } = interaction;

    const game =
      (await GameService.findGame({
        channelId,
        statuses: [GameStatus.IN_PROGRESS, GameStatus.SETUP],
      })) ?? undefined;

    const actionDiscordUser = interaction.user;
    const actionUser = await UserService.upsertUser({
      discordUser: actionDiscordUser,
    });

    const isGameOwner = game?.user.toString() === actionUser._id.toString();

    const actionPlayer = game
      ? (await PlayerService.findPlayerByGameAndDiscordId({
          gameId: game._id,
          discordId: actionDiscordUser.id,
        })) ?? undefined
      : undefined;

    await command.controller(interaction, {
      game,
      isGameOwner,
      actionUser,
      actionPlayer,
    });
  } catch (error) {
    return interaction.reply({
      content: `${(error as Error)?.message || "Unknown error has occured"}.`,
      ephemeral: true,
    });
  }
});

client.login(config.bot.token);
