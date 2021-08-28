import { User as DiscordUser } from "discord.js";

import { User, IUser } from "@/models/user";

export const findOrCreateUser = async ({ 
  discordUser,
}: { 
  discordUser: DiscordUser;
}) => {
  let user = await User.findOne({ discordId: discordUser.id });

  if (!user) {
    const userInput: IUser = {
      discordId: discordUser.id,
      username: discordUser.username,
      discriminator: discordUser.discriminator,
      avatar: discordUser.avatar,
    };

    user = await User.create(userInput);
  }

  return user;
};