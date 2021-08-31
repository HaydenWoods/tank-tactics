import { Config } from "@/types/config";
import { BoardPosition, BoardPositionBase } from "@/types/game";

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

export const getBoardPositions = ({ 
  players,
  xSize,
  ySize, 
}: { 
  players: IPlayer[]; 
  xSize: Config["game"]["xSize"]; 
  ySize: Config["game"]["ySize"];
}) => {
  const allPositions = getAllPositions({ xSize, ySize });
  const playerPositions = players.map((player) => player.position);

  const boardPositions: BoardPosition[] = allPositions.map((position) => {
    const isPlayer = playerPositions.find((playerPosition) => 
      positionMatch(playerPosition, position)
    ) ? true : false;

    if (isPlayer) {
      const player = players.find((player) => positionMatch(player.position, position));

      return {
        ...position,
        type: "player",
        player,
      }
    }

    return {
      ...position,
      type: "blank",
    };
  });
  
  return boardPositions;
};
