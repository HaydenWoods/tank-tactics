import pino from "pino";
import { Client } from "discord-slash-commands-client";

import { config } from "@/config";

import { commands } from "@/commands";

const logger = pino();

export const sleep = async (ms: number) =>
  new Promise((r) => setTimeout(r, ms));

export const index = async () => {
  const { token, applicationId } = config.bot;
  const { guildId } = config.commands;

  logger.info("Updating commands");
  logger.info({ scope: guildId ? "Guild" : "Global", guildId });

  if (!token || !applicationId) {
    throw new Error("No token or application id");
  }

  const client = new Client(token, applicationId);

  for (const command of commands) {
    logger.info({ command }, "Command");

    const updatedCommand = await client.createCommand(command.meta, guildId);

    logger.info({ updatedCommand }, "Updated command");

    await sleep(5000);
  }

  logger.info("Updates finished");
};

index();
