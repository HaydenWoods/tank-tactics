import { model, Document, Schema, PopulatedDoc } from "mongoose";
import { IGameDocument } from "./game";
import { IUserDocument } from "./user";

export interface IPlayer {
  user: PopulatedDoc<IUserDocument, IUserDocument["_id"]>;
  game: PopulatedDoc<IGameDocument, IGameDocument["_id"]>;
  health: number;
  points: number;
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
    health: { type: Number, default: 3 },
    points: { type: Number, default: 1 },
    range: { type: Number, default: 2 },
    position: {
      x: { type: Schema.Types.Number, default: -1, },
      y: { type: Schema.Types.Number, default: -1, },
    },
  },
  {
    timestamps: true,
  }
);

export const Player = model<IPlayerDocument>("Player", PlayerSchema);
