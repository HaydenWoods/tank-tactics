import Agenda, { Job } from "agenda";
import pino from "pino";
import { maxBy } from "lodash";

import { client } from "@/index";

import { GameStatus } from "@/types/game";

import { IPlayerDocument, Player } from "@/models/player";

import { GameService } from "@/services/game";
import { PlayerVote } from "@/models/playerVote";
import { PlayerStatus } from "@/types/player";

const logger = pino();

export default (agenda: Agenda) => {
  agenda.define("game:assignActionPoints", async (job: Job) => {
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

    const previousIteration = await GameService.getPreviousIteration({ game });
    let mostVotedPlayer: IPlayerDocument | undefined = undefined;

    if (previousIteration) {
      // Votes for each player on the previous iteration
      let playerVotes = await PlayerVote.aggregate([
        {
          $match: { iteration: previousIteration._id },
        },
        {
          $group: {
            _id: "$target",
            votes: { $sum: 1 },
          },
        },
      ]);

      await Player.populate(playerVotes, {
        path: "_id",
        populate: { path: "user" },
      });

      // Remove any votes for players who are now not ALIVE
      playerVotes = playerVotes.filter(({ _id }) => {
        if (_id.status !== PlayerStatus.ALIVE) {
          return false;
        }

        return true;
      });

      logger.info({ playerVotes }, "Votes cast in previous iteration");

      mostVotedPlayer = maxBy(playerVotes, (player) => player.votes)?._id;

      logger.info({ mostVotedPlayer }, "Most voted player");
    }

    game.players.forEach(async (player) => {
      if (player.status === PlayerStatus.ALIVE) {
        let actionPoints = player.actionPoints + 1;

        if (player._id === mostVotedPlayer?._id) {
          actionPoints += 1;
        }

        await Player.updateOne(
          {
            _id: player._id,
          },
          {
            actionPoints,
          }
        );
      }
    });

    const channel = await client.channels.fetch(game.channelId);

    if (channel?.isText()) {
      await channel.send(
        "All players have been given 1 additional action point."
      );

      if (mostVotedPlayer) {
        await channel.send(
          `${mostVotedPlayer.emoji}<@${mostVotedPlayer.user.discordId}> received the most votes and has been awared an extra action point.`
        );
      }
    }

    logger.info({ id }, "Assigned action points");
  });
};
