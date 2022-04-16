import Agenda, { Job } from "agenda";
import { DateTime } from "luxon";
import pino from "pino";

import { config } from "@/config";

import { GameStatus } from "@/types/game";

import { Player } from "@/models/player";

import { GameService } from "@/services/game";

import { randomDate } from "@/helpers/general";

const logger = pino();

export default (agenda: Agenda) => {
  agenda.define("actionPoints", async (job: Job) => {
    const gameId = job.attrs.data?.gameId as string;

    const game = await GameService.findGame({
      id: gameId,
      statuses: [GameStatus.IN_PROGRESS],
    });

    if (!game) {
      throw new Error("No game found");
    }

    game.players.forEach(async (player) => {
      await Player.updateOne(
        {
          _id: player._id,
        },
        {
          actionPoints: player.actionPoints + 1,
        }
      );
    });

    const min = DateTime.now()
      .plus({
        [config.game.intervals.actionPoints]: 1,
      })
      .startOf(config.game.intervals.actionPoints);

    const max = min.endOf(config.game.intervals.actionPoints);

    const nextInvokation = randomDate(min, max);

    await game.updateOne({
      nextInvokation: {
        actionPoints: nextInvokation.toISO(),
      },
    });

    logger.info(
      { gameId, min, max, nextInvokation: nextInvokation.toISO() },
      "Next invokation for actionPoints"
    );

    job.schedule(nextInvokation.toJSDate());

    await job.save();
  });
};
