import { FilterQuery, QueryOptions } from "mongoose";
import { random } from "lodash";

import { config } from "@/config";

import { GameStatus } from "@/types/game";
import { PlayerStatus } from "@/types/player";

import { Game, IGameDocument } from "@/models/game";
import { IPlayerDocument, Player } from "@/models/player";
import { IUserDocument } from "@/models/user";

import { getAllPositions } from "@/helpers/game";

export class GameService {
  static create = async ({
    guildId,
    channelId,
    user,
  }: {
    guildId: IGameDocument["guildId"];
    channelId: IGameDocument["channelId"];
    user: IUserDocument;
  }) => {
    const game = await Game.create({
      guildId,
      channelId,
      user,
    });

    return game;
  };

  static addPlayer = async ({
    game,
    user,
  }: {
    game: IGameDocument;
    user: IUserDocument;
  }) => {
    const player = await Player.create({
      user: user._id,
      game: game._id,
    });

    await game.updateOne({
      $push: {
        players: player,
      },
    });

    return player;
  };

  static findGame = async ({
    channelId,
    statuses,
  }: {
    channelId: IGameDocument["channelId"];
    statuses: GameStatus[];
  }) => {
    const game = await Game.findOne({
      channelId,
      $or: statuses.map((status) => ({ status })),
    }).populate({
      path: "players",
      populate: {
        path: "user",
      },
    });

    return game;
  };

  static start = async ({ game }: { game: IGameDocument }) => {
    await game.updateOne({
      status: GameStatus.IN_PROGRESS,
    });

    let allCoordinates = getAllPositions({
      xSize: config.game.xSize,
      ySize: config.game.ySize,
    });

    game.players.forEach(async (_id: IPlayerDocument["_id"]) => {
      const randomCoordinateIndex = random(0, allCoordinates.length, false);
      const randomCoordinate = allCoordinates[randomCoordinateIndex];

      allCoordinates.splice(randomCoordinateIndex, 1);

      await Player.updateOne({ _id }, { position: randomCoordinate });
    });
  };

  static cancel = async ({ game }: { game: IGameDocument }) => {
    await game.updateOne({
      status: GameStatus.CANCELLED,
    });
  };

  static removePlayer = async ({
    game,
    player,
  }: {
    game: IGameDocument;
    player: IPlayerDocument;
  }) => {
    await game.updateOne({
      $pull: {
        players: player._id,
      },
    });

    await player.updateOne({
      status: PlayerStatus.REMOVED,
    });
  };

  static updateState = async ({ game }: { game: IGameDocument }) => {};
}
