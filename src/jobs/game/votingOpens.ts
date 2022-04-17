import Agenda, { Job } from "agenda";
import pino from "pino";

import { client } from "@/index";

import { GameStatus } from "@/types/game";

import { Player } from "@/models/player";

import { GameService } from "@/services/game";

const logger = pino();

export default (agenda: Agenda) => {
  agenda.define("game:votingOpens", async (job: Job) => {
    const id = job.attrs.data?.id as string;

    if (!id) {
      throw new Error("No id supplied");
    }

    const game = await GameService.findGame({
      id,
      statuses: [GameStatus.IN_PROGRESS],
    });

    if (!game) {
      throw new Error("No game found");
    }

    const channel = await client.channels.fetch(game.channelId);

    if (channel?.isText()) {
      await channel.send(
        "All dead players can now vote for which player should receive an extra action point at the next handout."
      );
    }

    logger.info({ id }, "Assigned action points");
  });
};
