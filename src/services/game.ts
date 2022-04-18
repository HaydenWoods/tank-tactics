import { FilterQuery } from "mongoose";
import { random } from "lodash";

import { GameStatus } from "@/types/game";
import { PlayerStatus } from "@/types/player";

import { Game, IGameDocument } from "@/models/game";
import { IPlayerDocument, Player } from "@/models/player";
import { IUserDocument } from "@/models/user";

import { getAllPositions } from "@/helpers/game";
import { getBoardDimensions } from "@/helpers/board";
import Agenda from "agenda";
import {
  GameIteration,
  IGameIteration,
  IGameIterationDocument,
} from "@/models/gameIteration";

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
    emoji,
  }: {
    game: IGameDocument;
    user: IUserDocument;
    emoji?: IPlayerDocument["emoji"];
  }) => {
    const player = await Player.create({
      user: user._id,
      game: game._id,
      emoji,
    });

    await game.updateOne({
      $push: {
        players: player,
      },
    });

    return player;
  };

  static findGame = async ({
    id,
    channelId,
    statuses,
  }: {
    id?: IGameDocument["id"];
    channelId?: IGameDocument["channelId"];
    statuses: GameStatus[];
  }) => {
    if (!id && !channelId) return undefined;

    const filter: FilterQuery<IGameDocument> = {};

    if (id) {
      filter["_id"] = id;
    }

    if (channelId) {
      filter["channelId"] = channelId;
    }

    const game = await Game.findOne({
      ...filter,
      $or: statuses.map((status) => ({ status })),
    }).populate({
      path: "players",
      populate: {
        path: "user",
      },
    });

    return game;
  };

  static start = async ({
    game,
    agenda,
  }: {
    game: IGameDocument;
    agenda: Agenda;
  }) => {
    const dimensions = getBoardDimensions({
      playersCount: game.players.length,
    });

    const updatedGame = await Game.findOneAndUpdate(
      {
        _id: game._id,
      },
      {
        status: GameStatus.IN_PROGRESS,
        config: {
          width: dimensions[0],
          height: dimensions[1],
        },
      },
      {
        returnDocument: "after",
      }
    );

    if (!updatedGame) {
      throw new Error("Unable to update game");
    }

    let allPositions = getAllPositions({
      width: updatedGame.config.width,
      height: updatedGame.config.height,
    });

    game.players.forEach(async (_id: IPlayerDocument["_id"]) => {
      const randomCoordinateIndex = random(0, allPositions.length, false);
      const randomCoordinate = allPositions[randomCoordinateIndex];

      allPositions.splice(randomCoordinateIndex, 1);

      await Player.updateOne({ _id }, { position: randomCoordinate });
    });

    agenda.now("game:iterate", { id: game._id });
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

  static getWinner = async ({ game }: { game: IGameDocument }) => {
    const alivePlayers = game.players.filter(
      ({ status }) => status === PlayerStatus.ALIVE
    ) as IPlayerDocument[];

    let winningPlayer;

    if (alivePlayers.length === 1) {
      winningPlayer = alivePlayers[0];

      await game.updateOne({
        status: GameStatus.FINISHED,
        winner: winningPlayer._id,
      });
    }

    return { winningPlayer };
  };

  static getCurrentIteration = async ({ game }: { game: IGameDocument }) => {
    const currentIteration = ((
      await GameIteration.find({ game: game._id })
        .sort({ createdAt: -1 })
        .limit(1)
    )?.[0] ?? undefined) as IGameIterationDocument | undefined;

    return currentIteration;
  };

  static getPreviousIteration = async ({ game }: { game: IGameDocument }) => {
    const previousIteration = ((
      await GameIteration.find({ game: game._id })
        .sort({ createdAt: -1 })
        .limit(2)
    )?.[1] ?? undefined) as IGameIterationDocument | undefined;

    return previousIteration;
  };
}
