import { FilterQuery, QueryOptions } from "mongoose";

import { PlayerStatus } from "@/types/player";

import { IGameDocument } from "@/models/game";
import { IPlayerDocument, Player } from "@/models/player";
import { User, IUserDocument } from "@/models/user";
import { isPlayerInRange } from "@/helpers/player";

export const findPlayer = (
  query: FilterQuery<IPlayerDocument>, 
  options?: QueryOptions,
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
    return null;
  }

  const player = await findPlayer({ 
    user: user._id, 
    game: gameId 
  }).populate("user");

  return player;
};

export const shootPlayer = async ({ 
  actionPlayer, 
  targetPlayer,
}: { 
  actionPlayer: IPlayerDocument;
  targetPlayer: IPlayerDocument;
}) => {
  // Action player checks
  if (actionPlayer.status === PlayerStatus.DEAD) {
    throw new Error("You are dead");
  }
  if (actionPlayer.status === PlayerStatus.LEFT) {
    throw new Error("You have left the game");
  }
  if (actionPlayer.actionPoints <= 0) {
    throw new Error("You have no action points left");
  }

  // Target player checks
  if (targetPlayer.status === PlayerStatus.DEAD) {
    throw new Error("Target player is already dead");
  }
  if (targetPlayer.status === PlayerStatus.LEFT) {
    throw new Error("Target player has left the game");
  }

  // General checks
  if (!isPlayerInRange({ actionPlayer, targetPlayer })) {
    throw new Error("Target player is not in range");
  }
  if (actionPlayer._id.toString() === targetPlayer._id.toString()) {
    throw new Error("You can't shoot yourself");
  }

  await actionPlayer.updateOne({ actionPoints: actionPlayer.actionPoints - 1 });
  await targetPlayer.updateOne({ health: targetPlayer.health - 1 });
};
