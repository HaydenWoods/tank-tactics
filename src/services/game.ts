import { FilterQuery, QueryOptions } from "mongoose";
import { random } from "lodash";

import { config } from "@/config";

import { GameStatus } from "@/types/game";

import { Game, IGameDocument } from "@/models/game";
import { IHistory } from "@/models/history";
import { IPlayerDocument, Player } from "@/models/player";
import { IUserDocument } from "@/models/user";

export const findGame = (
  query: FilterQuery<IGameDocument>, 
  options: QueryOptions = { lean: true }
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
  }, options).populate("players");

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

  console.log(_id, game)

  game?.players.forEach(async (_id: IPlayerDocument["_id"]) => {
    const x = random(0, config.game.xSize, false);
    const y = random(0, config.game.ySize, false);

    console.log(game?.players, _id, x, y)

    await Player.updateOne({ _id }, { position: { x, y } });
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
    game: _id, 
    user: userId 
  });

  await Game.updateOne(
    { _id }, 
    { $push: { players: player } },
  );

  return player;
};