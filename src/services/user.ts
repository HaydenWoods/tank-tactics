import { User as DiscordUser } from "discord.js";
import { FilterQuery, QueryOptions } from "mongoose";

import { User, IUser, IUserDocument } from "@/models/user";
import { update } from "lodash";

export const findUser = (
  query: FilterQuery<IUserDocument>, 
  options?: QueryOptions,
) => {
  return User.findOne(query, null, options);
};

export const createUser = (
  input: IUser,
  options?: QueryOptions,
) => {
  return User.create(input);
};

export const updateUser = (
  query: FilterQuery<IUserDocument>, 
  input: IUser,
  options: QueryOptions = { new: true },
) => {
  return User.findOneAndUpdate(query, input, options);
};

export const createOrUpdateUser = async ({ 
  discordUser,
}: { 
  discordUser: DiscordUser;
}) => {
  const input: IUser = {
    discordId: discordUser.id,
    username: discordUser.username,
    discriminator: discordUser.discriminator,
    avatar: discordUser.avatar,
  };

  const query = { 
    discordId: discordUser.id 
  };

  const currentUser = await updateUser(query, input);
  
  if (!currentUser) {
    const createdUser = await createUser(input);
    return createdUser;
  }

  return currentUser;
};