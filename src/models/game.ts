import { model, Document, Schema, PopulatedDoc } from "mongoose";

import { GameStatus } from "@/types/game";

import { IPlayerDocument } from "@/models/player";

export interface IGame {
  guildId: string;
  channelId: string;
  status: GameStatus;
  user: string;
  players: PopulatedDoc<IPlayerDocument, IPlayerDocument["_id"]>[];
  config: {
    width: number;
    height: number;
  };
}

export interface IGameDocument extends IGame, Document {}

export const GameSchema = new Schema<IGameDocument>(
  {
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    status: { type: String, required: true, default: GameStatus.SETUP },
    user: { type: Schema.Types.ObjectId, ref: "user" },
    players: [{ type: Schema.Types.ObjectId, ref: "player" }],
    config: {
      width: { type: Schema.Types.Number },
      height: { type: Schema.Types.Number },
    },
  },
  {
    timestamps: true,
  }
);

export const Game = model<IGameDocument>("game", GameSchema);
