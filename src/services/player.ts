import { FilterQuery, QueryOptions } from "mongoose";

import { config } from "@/config";

import { Direction, PlayerInfo, PlayerStatus } from "@/types/player";

import { IGameDocument } from "@/models/game";
import { IPlayerDocument, Player } from "@/models/player";
import { User, IUserDocument } from "@/models/user";
import { isPlayerInRange } from "@/helpers/player";
import { positionMatch } from "@/helpers/game";

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
    game: gameId,
    $or: [
      { status: PlayerStatus.ALIVE },
      { status: PlayerStatus.DEAD },
    ],
  }).populate("user");

  return player;
};

export const shootPlayer = async ({ 
  actionPlayer, 
  targetPlayer,
  amount,
}: { 
  actionPlayer: IPlayerDocument;
  targetPlayer: IPlayerDocument;
  amount?: number;
}) => {
  // Target player checks
  if (targetPlayer.status === PlayerStatus.DEAD) {
    throw new Error("Target player is already dead");
  }
  if (targetPlayer.status === PlayerStatus.REMOVED) {
    throw new Error("Target player has left the game");
  }

  // Action player checks
  if (actionPlayer.status === PlayerStatus.DEAD) {
    throw new Error("You are dead");
  }
  if (actionPlayer.status === PlayerStatus.REMOVED) {
    throw new Error("You have left the game");
  }

  // General checks
  if (!isPlayerInRange({ actionPlayer, targetPlayer })) {
    throw new Error("Target player is not in range");
  }
  if (actionPlayer._id.toString() === targetPlayer._id.toString()) {
    throw new Error("You can't shoot yourself");
  } 
  
  const actualAmount = Math.min(amount || 1, targetPlayer.health);

  if (actionPlayer.actionPoints < actualAmount) {
    throw new Error("You do not have enough action points");
  }

  const targetPlayerHealth = targetPlayer.health - actualAmount;
  const targetPlayerIsDead = targetPlayerHealth <= 0;
  const targetPlayerActionPoints = targetPlayerIsDead ? 0 : targetPlayer.actionPoints;
  const targetPlayerStatus = targetPlayerIsDead ? PlayerStatus.DEAD : PlayerStatus.ALIVE;

  const actionPlayerActionPoints = (actionPlayer.actionPoints - actualAmount) + (targetPlayerIsDead ? targetPlayer.actionPoints : 0);

  await actionPlayer.updateOne({ 
    actionPoints: actionPlayerActionPoints 
  });

  await targetPlayer.updateOne({ 
    health: targetPlayerHealth,
    status: targetPlayerStatus,
    actionPoints: targetPlayerActionPoints,
  });

  return {
    actualAmount,
    targetPlayerIsDead,
  };
};

export const movePlayerDirection = async ({ 
  actionPlayer, 
  game,
  direction,
  amount,
}: { 
  actionPlayer: IPlayerDocument;
  game: IGameDocument;
  direction: Direction;
  amount?: number;
}) => {
  // Action player checks
  if (actionPlayer.status === PlayerStatus.DEAD) {
    throw new Error("You are dead");
  }
  if (actionPlayer.status === PlayerStatus.REMOVED) {
    throw new Error("You have left the game");
  }

  const actualAmount = amount || 1;

  if (actionPlayer.actionPoints < actualAmount) {
    throw new Error("You do not have enough action points");
  }

  const position = actionPlayer.position;

  if (direction === Direction.UP) {
    position.y = position.y - actualAmount;
  }
  if (direction === Direction.DOWN) {
    position.y = position.y + actualAmount;
  }
  if (direction === Direction.LEFT) {
    position.x = position.x - actualAmount;
  }
  if (direction === Direction.RIGHT) {
    position.x = position.x + actualAmount;
  }

  if (
    position.y > config.game.ySize || 
    position.y <= 0 || 
    position.x > config.game.xSize || 
    position.x <= 0
  ) {
    throw new Error("New position is out of bounds");
  }

  const playerPositions = game.players.map((player) => player.position);
  const doesMatchOtherPlayer = playerPositions.find((otherPlayerPosition) => positionMatch(position, otherPlayerPosition));

  if (doesMatchOtherPlayer) {
    throw new Error("Can't move to a populated position");
  } 

  const actionPlayerActionPoints = actionPlayer.actionPoints - actualAmount;

  await actionPlayer.updateOne({ 
    position,
    actionPoints: actionPlayerActionPoints,
  });
};

export const getPlayerInfo = ({ 
  actionPlayer, 
  targetPlayer 
}: { 
  actionPlayer: IPlayerDocument;
  targetPlayer: IPlayerDocument;
}) => {
  const isTargetPlayer = actionPlayer._id.toString() === targetPlayer._id.toString();
  
  const playerInfo: PlayerInfo = [
    { title: ":heart:", value: `${targetPlayer.health} hearts` },
    { title: ":compass:", value: `${targetPlayer.range} range` },
    { title: ":map:", value: `${targetPlayer.position.x} : ${targetPlayer.position.y}` },
    ...(isTargetPlayer ? [
      { title: ":gem:", value: `${targetPlayer.actionPoints} action points` }
    ] : []),
  ];

  return playerInfo;
};