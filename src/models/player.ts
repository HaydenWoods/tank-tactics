import { model, Document, Schema, PopulatedDoc } from "mongoose";

import { PlayerStatus } from "@/types/player";

import { IUserDocument } from "@/models/user";
import { IGameDocument } from "./game";

export interface IPlayer {
  user: PopulatedDoc<IUserDocument, IUserDocument["_id"]>;
  game: PopulatedDoc<IGameDocument, IGameDocument["_id"]>;
  emoji: string;
  status: PlayerStatus;
  health: number;
  actionPoints: number;
  range: number;
  position: {
    x: number;
    y: number;
  };
}

export interface IPlayerDocument extends IPlayer, Document {}

export const PlayerSchema = new Schema<IPlayerDocument>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    game: { type: Schema.Types.ObjectId, required: true, ref: "Game" },
    emoji: { type: Schema.Types.String },
    status: {
      type: Schema.Types.String,
      require: true,
      default: PlayerStatus.ALIVE,
    },
    health: { type: Number, default: 3 },
    actionPoints: { type: Number, default: 0 },
    range: { type: Number, default: 2 },
    position: {
      x: { type: Schema.Types.Number, default: -1 },
      y: { type: Schema.Types.Number, default: -1 },
    },
  },
  {
    timestamps: true,
  }
);

export const Player = model<IPlayerDocument>("Player", PlayerSchema);
