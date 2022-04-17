import { model, Document, Schema } from "mongoose";

export interface IGameIteration {
  game: string;
  start: Date;
  end: Date;
  events: {
    assignActionPoints: Date;
    dropHealth: Date;
    votingOpens: Date;
  };
}

export interface IGameIterationDocument extends IGameIteration, Document {}

export const GameIterationSchema = new Schema<IGameIterationDocument>(
  {
    game: { type: Schema.Types.ObjectId, ref: "game" },
    start: { type: Schema.Types.Date, required: true },
    end: { type: Schema.Types.Date, required: true },
    events: {
      assignActionPoints: { type: Schema.Types.Date },
      dropHealth: { type: Schema.Types.Date },
      votingOpens: { type: Schema.Types.Date },
    },
  },
  {
    timestamps: true,
  }
);

export const GameIteration = model<IGameIterationDocument>(
  "gameIteration",
  GameIterationSchema
);
