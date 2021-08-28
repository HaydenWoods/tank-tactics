import { model, Document, Schema, PopulatedDoc, Model } from "mongoose";

import { GameStatus } from "@/types/game";

import { HistorySchema, IHistory } from "@/models/history";
import { IPlayerDocument } from "@/models/player";

export interface IGame {
  guildId: string;
  channelId: string;
  status: GameStatus;
  user: string;
  players: PopulatedDoc<IPlayerDocument, IPlayerDocument["_id"]>[];
  histories: IHistory[];
}

export interface IGameDocument extends IGame, Document {}

export const GameSchema = new Schema<IGameDocument>(
  {
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    status: { type: String, required: true, default: GameStatus.SETUP },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    players: [{ type: Schema.Types.ObjectId, ref: "Player" }],
    histories: [HistorySchema],
  },
  {
    timestamps: true,
  }
);

export const Game = model<IGameDocument>("Game", GameSchema);
