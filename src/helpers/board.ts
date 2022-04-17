import { config } from "@/config";

import { factors } from "@/helpers/general";
import { Config } from "@/types/config";

export const getBoardDimensions = (params: {
  playersCount: number;
  cellsPerPlayer?: Config["game"]["board"]["cellsPerPlayer"];
  ratio?: Config["game"]["board"]["ratio"];
  ratioOffset?: Config["game"]["board"]["ratioOffset"];
}) => {
  // Default values
  const { playersCount, cellsPerPlayer, ratio, ratioOffset } = {
    cellsPerPlayer: config.game.board.cellsPerPlayer,
    ratio: config.game.board.ratio,
    ratioOffset: config.game.board.ratioOffset,
    ...params,
  };

  let dimensions: [number, number] = [0, 0];

  let boardArea = playersCount * cellsPerPlayer;

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
      const ratioDiff = Math.abs(ratio - width / height);

      if (ratioDiff < closestRatioDiff) {
        closestRatioDiff = ratioDiff;
        closestDimensions = [width, height];
      }
    });

    if (closestRatioDiff < ratioOffset) {
      dimensions = closestDimensions;
      break;
    } else {
      boardArea += 1;
    }
  }

  return dimensions;
};
