import pino from "pino";

import { config } from "@/config";

import { factors } from "@/helpers/general";

const logger = pino();

export const getBoardDimensions = ({
  playersCount,
}: {
  playersCount: number;
}) => {
  let dimensions: [number, number] = [0, 0];

  let boardArea = playersCount * config.game.board.cellsPerPlayer;

  while (true) {
    const boardAreaSquareRoot = Math.sqrt(boardArea);
    const boardAreaFactors = factors(boardArea);

    const boardWidths = boardAreaFactors.filter(
      (factor) => factor > boardAreaSquareRoot
    );

    let closestRatioDiff: number = Infinity;
    let closestDimensions: [number, number] = dimensions;

    boardWidths.forEach((width) => {
      const height = boardArea / width;
      const ratio = width / height;
      const ratioDiff = Math.abs(config.game.board.ratio - ratio);

      if (ratioDiff < closestRatioDiff) {
        closestRatioDiff = ratioDiff;
        closestDimensions = [width, height];
      }
    });

    if (closestRatioDiff < config.game.board.ratioOffset) {
      dimensions = closestDimensions;
      break;
    } else {
      boardArea += 1;
    }
  }

  return dimensions;
};
