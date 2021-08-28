import { ICommand } from "@/types/command";

import { add } from "@/commands/add";
import { create } from "@/commands/create";
import { cancel } from "@/commands/cancel";
import { me } from "@/commands/me";
import { pause } from "@/commands/pause";
import { resume } from "@/commands/resume";
import { start } from "@/commands/start";

export const commands: Record<string, ICommand> = {
  add,
  create,
  cancel,
  me,
  pause,
  resume,
  start,
};
