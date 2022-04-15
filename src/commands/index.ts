import { commands as botCommands } from "@/commands/bot";
import { commands as gameCommands } from "@/commands/game";
import { commands as playerCommands } from "@/commands/player";

import { Command } from "@/types/command";

export const commands: Command[] = [
  ...botCommands,
  ...gameCommands,
  ...playerCommands,
];
