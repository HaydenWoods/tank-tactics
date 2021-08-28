import { model, Document, Schema, PopulatedDoc } from "mongoose";

import { HistoryType } from "@/types/history";

import { IGameDocument } from "@/models/game";
import { IUserDocument } from "@/models/user";

export interface IHistory {
  game: PopulatedDoc<IGameDocument>;
  user: PopulatedDoc<IUserDocument>;
  type: HistoryType;
  meta?: any;
}

export interface IHistoryDocument extends IHistory, Document {}

export const HistorySchema = new Schema<IHistoryDocument>(
  {
    game: { type: Schema.Types.ObjectId, required: true, ref: "Game" },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    type: { type: Schema.Types.String, required: true },
    meta: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

export const History = model<IHistoryDocument>("History", HistorySchema);
