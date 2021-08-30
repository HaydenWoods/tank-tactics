import { ICommand } from "@/types/command";

import { add } from "@/commands/add";
import { board } from "@/commands/board";
import { create } from "@/commands/create";
import { cancel } from "@/commands/cancel";
import { me } from "@/commands/me";
import { pause } from "@/commands/pause";
import { resume } from "@/commands/resume";
import { shoot } from "@/commands/shoot";
import { start } from "@/commands/start";

export const commands: Record<string, ICommand> = {
  add,
  board,
  create,
  cancel,
  me,
  pause,
  resume,
  shoot,
  start,
};
