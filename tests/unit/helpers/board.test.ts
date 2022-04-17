import { desiredTestDimensions } from "./board.constants";

import { getBoardDimensions } from "@/helpers/board";

describe("Board helpers", () => {
  describe("getBoardDimensions", () => {
    const options = {
      cellsPerPlayer: 9,
      ratio: 1.33,
      ratioOffset: 0.17,
    };

    for (let i = 0; i < 10; i++) {
      const desiredDimensions = desiredTestDimensions[i];
      it(`${i + 1} player count board, expect ${desiredDimensions[0]}, ${
        desiredDimensions[1]
      }`, () => {
        const dimensions = getBoardDimensions({
          ...options,
          playersCount: i + 1,
        });

        expect(dimensions).toEqual(desiredDimensions);
      });
    }
  });
});
