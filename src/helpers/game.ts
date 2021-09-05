import { Config } from "@/types/config";
import { BoardPositionBase } from "@/types/game";

import { IPlayer } from "@/models/player";

export const positionMatch = (position1: BoardPositionBase, position2: BoardPositionBase) => {
  return (position1.x === position2.x) && (position1.y === position2.y);
};

export const getAllPositions = ({ 
  xSize, 
  ySize,
}: { 
  xSize: Config["game"]["xSize"]; 
  ySize: Config["game"]["ySize"];
}) => {
  const allPositions: IPlayer["position"][] = [];

  for (let y = 1; y <= ySize; y++) {
    for (let x = 1; x <= xSize; x++) {
      allPositions.push({ x, y });
    }
  }

  return allPositions;
};