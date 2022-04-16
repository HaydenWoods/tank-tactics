import { Config } from "@/types/config";
import { BoardPositionBase } from "@/types/game";

import { IPlayer } from "@/models/player";

export const positionMatch = (
  position1: BoardPositionBase,
  position2: BoardPositionBase
) => {
  return position1.x === position2.x && position1.y === position2.y;
};

export const getAllPositions = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const allPositions: IPlayer["position"][] = [];

  for (let y = 1; y <= height; y++) {
    for (let x = 1; x <= width; x++) {
      allPositions.push({ x, y });
    }
  }

  return allPositions;
};
