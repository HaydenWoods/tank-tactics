import { ICommand } from "../types/command";

import { add } from "@/commands/add";
import { board } from "@/commands/board";
import { create } from "@/commands/create";
import { info } from "@/commands/info";
import { cancel } from "@/commands/cancel";
import { me } from "@/commands/me";
import { move } from "@/commands/move";
import { pause } from "@/commands/pause";
import { resume } from "@/commands/resume";
import { shoot } from "@/commands/shoot";
import { start } from "@/commands/start";

export const commands: Record<string, ICommand> = {
  add,
  board,
  create,
  info,
  cancel,
  me,
  move,
  pause,
  resume,
  shoot,
  start,
};