import { CommandInteraction } from "discord.js";

import { IGameDocument } from "@/models/game";
import { IPlayerDocument } from "@/models/player";
import { IUserDocument } from "@/models/user";

export interface ICommand {
  data: any;
  execute: (interaction: CommandInteraction, { 
    actionUser, 
    game, 
    actionPlayer 
  }: { 
    actionUser: IUserDocument;
    game: IGameDocument | null;
    actionPlayer: IPlayerDocument | null;
  }) => Promise<void>;
}
