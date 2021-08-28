import { Config } from "@/types/config";
import { BoardPosition } from "@/types/game";

import { IPlayer } from "@/models/player";

export const getAllPositions = ({ 
  xSize, 
  ySize,
}: { 
  xSize: Config["game"]["xSize"]; 
  ySize: Config["game"]["ySize"];
}) => {
  const allPositions: IPlayer["position"][] = [];

  for (let x = 0; x <= xSize; x++) {
    for (let y = 0; y <= ySize; y++) {
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
    if (playerPositions.includes(position)) {
      const player = players.find((player) => player.position === position);

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
