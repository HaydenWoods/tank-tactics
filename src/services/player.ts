import { FilterQuery, QueryOptions } from "mongoose";

import { config } from "@/config";

import { Direction, PlayerInfo, PlayerStatus } from "@/types/player";

import { IGameDocument } from "@/models/game";
import { IPlayerDocument, Player } from "@/models/player";
import { User, IUserDocument } from "@/models/user";

import { isPlayerAlive, isPlayerInRange } from "@/helpers/player";
import { positionMatch } from "@/helpers/game";
import { Items } from "@/types/shop";
import { SHOP_ITEMS } from "@/constants/shop";

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

export const setPlayerHealth = async ({
  actionPlayer,
  targetPlayer,
  health,
}: {
  actionPlayer?: IPlayerDocument;
  targetPlayer: IPlayerDocument;
  health: number;
}) => {
  if (targetPlayer.status === PlayerStatus.REMOVED) {
    throw new Error("Target player doesn't exist in the game");
  }
  if (actionPlayer && actionPlayer.status === PlayerStatus.REMOVED) {
    throw new Error("Action player doesn't exist in the game");
  }

  const wasDead = targetPlayer.status === PlayerStatus.DEAD;
  const wasAlive = targetPlayer.status === PlayerStatus.ALIVE;

  const targetPlayerHealth = Math.max(health, 0);

  const isNowDead = targetPlayerHealth <= 0 && wasAlive;
  const isNowAlive = targetPlayerHealth > 0 && wasDead;

  const targetPlayerActionPoints = (isNowDead || isNowAlive) ? 0 : targetPlayer.actionPoints;
  let actionPlayerActionPoints = actionPlayer?.actionPoints || 0;

  if (isNowDead && actionPlayer) {
    actionPlayerActionPoints += targetPlayer.actionPoints;

    await actionPlayer.updateOne({
      actionPoints: actionPlayerActionPoints,
    });
  }

  await targetPlayer.updateOne({
    health,
    actionPoints: targetPlayerActionPoints, 
    status: isNowDead ? PlayerStatus.DEAD : PlayerStatus.ALIVE,
  });

  return {
    isNowDead,
    isNowAlive,
    targetPlayerHealth,
    targetPlayerActionPoints,
    actionPlayerActionPoints,
  };
};

export const shootPlayer = async ({ 
  actionPlayer, 
  targetPlayer,
  amount,
}: { 
  actionPlayer: IPlayerDocument;
  targetPlayer: IPlayerDocument;
  amount: number;
}) => {
  if (!isPlayerAlive({ player: targetPlayer })) {
    throw new Error("Target player is dead or doesn't exist in the game");
  }
  if (!isPlayerAlive({ player: actionPlayer })) {
    throw new Error("You are dead or don't exist in the game");
  }
  if (!isPlayerInRange({ actionPlayer, targetPlayer })) {
    throw new Error("Target player is not in range");
  }
  if (actionPlayer._id.toString() === targetPlayer._id.toString()) {
    throw new Error("You can't shoot yourself");
  } 
  
  const actualAmount = Math.min(amount, targetPlayer.health);

  if (actionPlayer.actionPoints < actualAmount) {
    throw new Error("You do not have enough action points");
  }

  const resultingHealth = targetPlayer.health - actualAmount;

  let {
    isNowDead,
    actionPlayerActionPoints,
  } = await setPlayerHealth({ 
    actionPlayer, 
    targetPlayer, 
    health: resultingHealth 
  });

  actionPlayerActionPoints = actionPlayerActionPoints - actualAmount;

  await actionPlayer.updateOne({
    actionPoints: actionPlayerActionPoints,
  });

  return {
    isNowDead,
    resultingHealth,
    actualAmount,
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
  if (!isPlayerAlive({ player: actionPlayer })) {
    throw new Error("You are dead or don't exist in the game");
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

export const givePlayerActionPoints = async ({
  actionPlayer,
  targetPlayer,
  amount,
}: {
  actionPlayer: IPlayerDocument;
  targetPlayer: IPlayerDocument;
  amount: number;
}) => {
  if (!isPlayerAlive({ player: targetPlayer })) {
    throw new Error("Target player is dead or doesn't exist in the game");
  }
  if (!isPlayerAlive({ player: actionPlayer })) {
    throw new Error("You are dead or don't exist in the game");
  }
  if (!isPlayerInRange({ actionPlayer, targetPlayer })) {
    throw new Error("Target player is not in range");
  }
  if (actionPlayer._id.toString() === targetPlayer._id.toString()) {
    throw new Error("You can't give to yourself");
  } 
  if (actionPlayer.actionPoints < amount) {
    throw new Error("You do not have enough action points to give");
  }

  const actionPlayerActionPoints = actionPlayer.actionPoints - amount;
  const targetPlayerActionPoints = targetPlayer.actionPoints + amount;

  await actionPlayer.updateOne({
    actionPoints: actionPlayerActionPoints,
  });

  await targetPlayer.updateOne({
    actionPoints: targetPlayerActionPoints,
  });
};

export const givePlayerHealth = async ({
  actionPlayer,
  targetPlayer,
  amount,
}: {
  actionPlayer: IPlayerDocument;
  targetPlayer: IPlayerDocument;
  amount: number;
}) => {
  if (targetPlayer.status === PlayerStatus.REMOVED) {
    throw new Error("Target player doesn't exist in the game");
  }
  if (actionPlayer && actionPlayer.status === PlayerStatus.REMOVED) {
    throw new Error("Action player doesn't exist in the game");
  }
  if (!isPlayerInRange({ actionPlayer, targetPlayer })) {
    throw new Error("Target player is not in range");
  }
  if (actionPlayer._id.toString() === targetPlayer._id.toString()) {
    throw new Error("You can't give to yourself");
  } 
  if (actionPlayer.health < amount) {
    throw new Error(`You do not have enough health to give`);
  }

  const actionPlayerHealth = actionPlayer.health - amount;
  const targetPlayerHealth = targetPlayer.health + amount;

  const actionPlayerRes = await setPlayerHealth({ 
    targetPlayer: actionPlayer, 
    health: actionPlayerHealth 
  });

  const targetPlayerRes = await setPlayerHealth({ 
    targetPlayer, 
    health: targetPlayerHealth 
  });

  return {
    isActionPlayerDead: actionPlayerRes.isNowDead,
    isTargetPlayerAlive: targetPlayerRes.isNowAlive,
  };
};

export const buyItem = async ({
  player,
  item,
  amount,
}: {
  player: IPlayerDocument;
  item: Items;
  amount: number;
}) => {
  if (!isPlayerAlive({ player })) {
    throw new Error("You are dead or don't exist in the game");
  }
  
  const shopItem = SHOP_ITEMS[item];

  if (!shopItem) {
    throw new Error("Item was not found");
  }

  const { price } = shopItem;
  const totalPrice = price * amount;

  if (player.actionPoints < totalPrice) {
    throw new Error("You do not have enough action points to buy this item");
  }

  const playerActionPoints = player.actionPoints - totalPrice;
  const playerItems = player[item] + amount; 

  await player.updateOne({
    actionPoints: playerActionPoints,
    [item]: playerItems,
  });
}
