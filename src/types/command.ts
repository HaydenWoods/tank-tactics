import { CommandInteraction } from "discord.js";

import { IGameDocument } from "@/models/game";
import { IPlayerDocument } from "@/models/player";
import { IUserDocument } from "@/models/user";

export interface ICommand {
  data: any;
  execute: (interaction: CommandInteraction, { 
    game, 
    actionUser, 
    isAdmin,
    actionPlayer 
  }: { 
    game: IGameDocument | null;
    actionUser: IUserDocument;
    isAdmin: boolean;
    actionPlayer: IPlayerDocument | null;
  }) => Promise<void>;
}
