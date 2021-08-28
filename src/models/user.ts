import { model, Document, Schema } from "mongoose";

export interface IUser {
  discordId: string;
  username: string;
  discriminator: string;
  avatar?: string | null;
}

export interface IUserDocument extends IUser, Document {}

export const UserSchema = new Schema<IUserDocument>(
  {
    discordId: { type: String, required: true, unique: true },
    username: { type: String },
    discriminator: { type: String },
    avatar: { type: String },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUserDocument>("User", UserSchema);
