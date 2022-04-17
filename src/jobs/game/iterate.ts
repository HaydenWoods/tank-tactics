import Agenda, { Job } from "agenda";
import { DateTime } from "luxon";
import pino from "pino";

import { config } from "@/config";

import { GameStatus } from "@/types/game";

import { GameIteration } from "@/models/gameIteration";

import { GameService } from "@/services/game";

import { randomDate } from "@/helpers/general";

const logger = pino();

export default (agenda: Agenda) => {
  agenda.define("game:iterate", async (job: Job) => {
    const id = job.attrs.data?.id as string;

    if (!id) {
      throw new Error("No id supplied for job game:iterate");
    }

    const game = await GameService.findGame({
      id,
      statuses: [GameStatus.IN_PROGRESS],
    });

    if (!game) {
      throw new Error("No game found for job game:iterate");
    }

    logger.info({ id }, "Next iteration for game");

    const currentIteration = await GameService.getCurrentIteration({ game });

    let nextIterationStart: DateTime;

    if (currentIteration) {
      logger.info(currentIteration.toObject(), "Found previous iteration");

      nextIterationStart = DateTime.fromJSDate(currentIteration.start).plus({
        [config.game.iterationInterval]: 1,
      });
    } else {
      nextIterationStart = DateTime.now();
    }

    nextIterationStart = nextIterationStart.startOf(
      config.game.iterationInterval
    );

    const nextIterationEnd = nextIterationStart.endOf(
      config.game.iterationInterval
    );

    const nextIterationAssignActionPoints = currentIteration
      ? randomDate(nextIterationStart, nextIterationEnd)
      : nextIterationStart;
    const nextIterationDropHealth = randomDate(
      nextIterationStart,
      nextIterationEnd
    );
    const nextIterationVotingOpens = nextIterationAssignActionPoints;

    const nextIteration = await GameIteration.create({
      game: game._id,
      start: nextIterationStart.toISO(),
      end: nextIterationEnd.toISO(),
      events: {
        assignActionPoints: nextIterationAssignActionPoints.toISO(),
        dropHealth: nextIterationDropHealth.toISO(),
        votingOpens: nextIterationVotingOpens.toISO(),
      },
    });

    job.schedule(nextIterationEnd.toJSDate());
    await job.save();

    await agenda.schedule(
      nextIterationAssignActionPoints.toJSDate(),
      "game:assignActionPoints",
      { id }
    );

    await agenda.schedule(
      nextIterationVotingOpens.toJSDate(),
      "game:votingOpens",
      { id }
    );

    logger.info(nextIteration.toObject(), "Created next iteration");
  });
};
