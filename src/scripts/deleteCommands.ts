import { Client } from "discord-slash-commands-client";

import { config } from "../config";

export const sleep = async (ms: number) => new Promise(r => setTimeout(r, ms));

export const index = async () => {
  const { token, applicationId } = config.bot;

  console.log("Deleting commands");
  
  if (!token || !applicationId) {
    throw new Error("No token or application id");
  }

  const client = new Client(token, applicationId);

  const commands = await client.getCommands({})

  for (const command of Array.isArray(commands) ? commands : [commands]) {
    await client.deleteCommand(command.id);

    console.log("Deleted command >", command.id);

    await sleep(5000);
  }

  console.log("Deletes finished");
};

index();