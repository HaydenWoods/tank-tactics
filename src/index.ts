import mongoose from "mongoose";
import { Client } from "discord.js";

import { config } from "@/config";
import { commands } from "@/commands";

import { createOrUpdateUser } from "@/services/user";
import { findGameByStatusAndChannelId } from "@/services/game";

import { findPlayerByGameAndDiscordId } from "@/services/player";
import { GameStatus } from "./types/game";

mongoose.connect(
  config.mongo.url,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => {
    console.log("Database connected");
  }
);

export const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
  partials: ["CHANNEL"],
});

client.once("ready", () => {
  console.log("Tank Tactics has started");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (!Object.keys(commands).includes(commandName)) return;

  try {
    const { channelId } = interaction;

    const game = await findGameByStatusAndChannelId({
      channelId,
      statuses: [
        GameStatus.IN_PROGRESS, 
        GameStatus.SETUP, 
        GameStatus.PAUSED
      ],
    });

    const actionDiscordUser = interaction.user;
    const actionUser = await createOrUpdateUser({ discordUser: actionDiscordUser });

    const isAdmin = game?.user.toString() === actionUser._id.toString();

    const actionPlayer = game ? await findPlayerByGameAndDiscordId({
      gameId: game._id,
      discordId: actionDiscordUser.id,
    }) : null;

    await commands[commandName].execute(interaction, {
      game,
      actionUser,
      isAdmin,
      actionPlayer,
    });
  } catch (error) {
    return interaction.reply({
      content: (error as Error)?.message || "Unknown error has occured",
      ephemeral: true,
    });
  }
});

client.login(config.bot.token);
