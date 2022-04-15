import pino from "pino";
import { Client } from "discord-slash-commands-client";

import { config } from "@/config";

const logger = pino();

export const sleep = async (ms: number) =>
  new Promise((r) => setTimeout(r, ms));

export const index = async () => {
  const { token, applicationId } = config.bot;
  const { guildId } = config.commands;

  logger.info("Starting deleting commands");

  if (!token || !applicationId) {
    throw new Error("No token or application ID");
  }

  const client = new Client(token, applicationId);

  const commands = await client.getCommands({ guildID: guildId });

  for (const command of Array.isArray(commands) ? commands : [commands]) {
    await client.deleteCommand(command.id, guildId);

    logger.info("Deleted command >", command.id);

    await sleep(5000);
  }

  logger.info("Finished delete commands");
};

index();
