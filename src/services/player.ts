import { FilterQuery, QueryOptions } from "mongoose";

import { IGameDocument } from "@/models/game";
import { IPlayerDocument, Player } from "@/models/player";
import { User, IUserDocument } from "@/models/user";

export const findPlayer = (
  query: FilterQuery<IPlayerDocument>, 
  options: QueryOptions = { lean: true }
) => {
  return Player.findOne(query, null, options);
};

export const findPlayerByGameAndDiscordId = async ({ 
  discordId, 
  gameId,
}: { 
  discordId: IUserDocument["discordId"], 
  gameId: IGameDocument["_id"],
}) => {
  const user = await User.findOne({ discordId });

  if (!user) {
    throw new Error("User does not exist");
  }

  const player = await findPlayer({ 
    user: user._id, 
    game: gameId 
  }).populate("user");

  if (!player) {
    throw new Error("Player does not exist");
  }

  return player;
};