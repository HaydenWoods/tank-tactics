import { ICommand } from "../types/command";

import { add } from "@/commands/add";
import { board } from "@/commands/board";
import { buy } from "@/commands/buy";
import { cancel } from "@/commands/cancel";
import { create } from "@/commands/create";
import { give } from "@/commands/give";
import { help } from "@/commands/help";
import { info } from "@/commands/info";
import { me } from "@/commands/me";
import { move } from "@/commands/move";
import { pause } from "@/commands/pause";
import { remove } from "@/commands/remove";
import { resume } from "@/commands/resume";
import { shoot } from "@/commands/shoot";
import { start } from "@/commands/start";

export const commands: Record<string, ICommand> = {
  add,
  board,
  buy,
  cancel,
  create,
  give,
  help,
  info,
  me,
  move,
  pause,
  remove,
  resume,
  shoot,
  start,
};