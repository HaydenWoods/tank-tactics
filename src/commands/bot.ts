import { BotController } from "@/controllers/bot";
import { Command } from "@/types/command";

export const commands: Command[] = [
  {
    meta: {
      name: "help",
      description: "Show the help",
    },
    controller: BotController.displayHelp,
  },
];
