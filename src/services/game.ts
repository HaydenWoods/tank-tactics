import { FilterQuery, QueryOptions } from "mongoose";
import { random } from "lodash";

import { config } from "@/config";

import { GameStatus } from "@/types/game";

import { Game, IGameDocument } from "@/models/game";
import { IHistory } from "@/models/history";
import { IPlayerDocument, Player } from "@/models/player";
import { IUserDocument } from "@/models/user";

import { getAllPositions } from "@/helpers/game";

export const findGame = (
  query: FilterQuery<IGameDocument>, 
  options?: QueryOptions,
) => {
  return Game.findOne(query, null, options);
};

export const findGameByStatusAndChannelId = async ({ 
  channelId, 
  statuses,
}: { 
  channelId: IGameDocument["channelId"]; 
  statuses: GameStatus[];
}, options?: QueryOptions) => {
  const game = await findGame({ 
    channelId,
    $or: statuses.map((status) => ({ status })),
  }, options).populate({ path: "players", populate: { path: "user" } });

  return game;
};

export const startGame = async ({ 
  _id,
}: { 
  _id: IGameDocument["_id"];
}) => {
  const game = await Game.findOneAndUpdate(
    { _id }, 
    { status: GameStatus.IN_PROGRESS },
    { lean: true, new: true },
  );

  let allCoordinates = getAllPositions({ 
    xSize: config.game.xSize, 
    ySize: config.game.ySize 
  });

  game?.players.forEach(async (_id: IPlayerDocument["_id"]) => {
    const randomCoordinateIndex = random(0, allCoordinates.length, false);
    const randomCoordinate = allCoordinates[randomCoordinateIndex];

    allCoordinates.splice(randomCoordinateIndex, 1);

    await Player.updateOne({ _id }, { position: randomCoordinate });
  });
};

export const cancelGame = async ({ 
  _id,
}: { 
  _id: IGameDocument["_id"];
}) => {
  await Game.updateOne(
    { _id }, 
    { status: GameStatus.CANCELLED },
  );
};

export const pauseGame = async ({
  _id,
}: {
  _id: IGameDocument["_id"];
}) => {
  await Game.updateOne(
    { _id },
    { status: GameStatus.PAUSED },
  );
};

export const resumeGame = async ({
  _id,
}: {
  _id: IGameDocument["_id"];
}) => {
  await Game.updateOne(
    { _id },
    { status: GameStatus.IN_PROGRESS },
  );
};

export const addGameHistory = async ({
  _id,
  history,
}: {
  _id: IGameDocument["_id"];
  history: IHistory;
}) => {
  await Game.updateOne(
    { _id },
    { $push: { histories: history } },
  );
};

export const addGamePlayer = async ({ 
  _id, 
  userId, 
}: { 
  _id: IGameDocument["_id"], 
  userId: IUserDocument["_id"],
}) => {
  const player = await Player.create({ 
    user: userId,
    game: _id,
  });

  await Game.updateOne(
    { _id }, 
    { $push: { players: player } },
  );

  return player;
};