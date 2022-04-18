import { User as DiscordUser } from "discord.js";
import { FilterQuery, QueryOptions } from "mongoose";

import { User, IUser, IUserDocument } from "@/models/user";

export class UserService {
  static findUser = (
    query: FilterQuery<IUserDocument>,
    options?: QueryOptions
  ) => {
    return User.findOne(query, null, options);
  };

  static createUser = (input: IUser) => {
    return User.create(input);
  };

  static updateUser = (
    query: FilterQuery<IUserDocument>,
    input: IUser,
    options: QueryOptions = { new: true }
  ) => {
    return User.findOneAndUpdate(query, input, options);
  };

  static upsertUser = async ({ discordUser }: { discordUser: DiscordUser }) => {
    const input: IUser = {
      discordId: discordUser.id,
      username: discordUser.username,
      discriminator: discordUser.discriminator,
      avatar: discordUser.avatar,
    };

    const query = {
      discordId: discordUser.id,
    };

    const currentUser = await UserService.updateUser(query, input);

    if (!currentUser) {
      const createdUser = await UserService.createUser(input);
      return createdUser;
    }

    return currentUser;
  };
}
