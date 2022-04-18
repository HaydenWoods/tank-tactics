import mongoose from "mongoose";
import pino from "pino";
import { Client } from "discord.js";
import Agenda, { Job } from "agenda";

import { config } from "@/config";
import { commands } from "@/commands";

import { GameStatus } from "@/types/game";

import { GameService } from "@/services/game";
import { PlayerService } from "@/services/player";
import { UserService } from "@/services/user";

const logger = pino();

mongoose.connect(
  `${config.mongo.url}/tank-tactics`,
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

const agenda = new Agenda({
  db: {
    address: `${config.mongo.url}/agenda`,
  },
});

agenda.start().then(async () => {
  (await import("@/jobs/game/iterate")).default(agenda);
  (await import("@/jobs/game/assignActionPoints")).default(agenda);
  (await import("@/jobs/game/votingOpens")).default(agenda);
});

agenda.on("fail", (error: Error, job: Job) => {
  logger.error(error, `${job.attrs.name} errored`);
});

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

    let game =
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
      agenda,
      game,
      isGameOwner,
      actionUser,
      actionPlayer,
    });

    // if (game) {
    //   game =
    //     (await GameService.findGame({
    //       channelId,
    //       statuses: [GameStatus.IN_PROGRESS],
    //     })) ?? undefined;

    //   if (!game) return;

    //   const { winningPlayer } = await GameService.getWinner({ game });

    //   if (winningPlayer) {
    //     await interaction.followUp(`<@${winningPlayer.user.discordId}> has won!`);
    //   }
    // }
  } catch (error) {
    logger.error(error);

    return interaction.reply({
      content: `${(error as Error)?.message || "Unknown error has occured"}.`,
      ephemeral: true,
    });
  }
});

client.login(config.bot.token);
