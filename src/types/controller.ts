import Agenda from "agenda";

import { IGameDocument } from "@/models/game";
import { IPlayerDocument } from "@/models/player";
import { IUserDocument } from "@/models/user";

export type ControllerParams = {
  agenda: Agenda;
  game?: IGameDocument;
  isGameOwner?: boolean;
  actionUser: IUserDocument;
  actionPlayer?: IPlayerDocument;
};
