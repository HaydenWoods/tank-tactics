import { model, Document, Schema, PopulatedDoc } from "mongoose";

import { IPlayerDocument } from "@/models/player";

export interface IPlayerVote {
  player: PopulatedDoc<IPlayerDocument, IPlayerDocument["_id"]>;
}

export interface IPlayerVoteDocument extends IPlayerVote, Document {}

export const PlayerVoteSchema = new Schema<IPlayerVoteDocument>(
  {
    game: { type: Schema.Types.ObjectId, required: true, ref: "game" },
    iteration: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "gameIteration",
    },
    player: { type: Schema.Types.ObjectId, required: true, ref: "player" },
    target: { type: Schema.Types.ObjectId, required: true, ref: "player" },
  },
  {
    timestamps: true,
  }
);

export const PlayerVote = model<IPlayerVoteDocument>(
  "playerVote",
  PlayerVoteSchema
);
