import { CommandInteraction } from "discord.js";

import { IGameDocument } from "@/models/game";
import { IPlayerDocument } from "@/models/player";
import { IUserDocument } from "@/models/user";

export type ControllerParams = {
  game?: IGameDocument;
  isGameOwner?: boolean;
  actionUser: IUserDocument;
  actionPlayer?: IPlayerDocument;
};
