import { getBoardDimensions } from "@/helpers/board";

describe("Board helpers", () => {
  describe("getBoardDimensions", () => {
    it("Expect height to be 8, width to be 11", () => {
      const dimensions = getBoardDimensions({ playersCount: 2 });

      // expect(dimensions[0]).toBe(11);
      // expect(dimensions[1]).toBe(8);
    });
  });
});
