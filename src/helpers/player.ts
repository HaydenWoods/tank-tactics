import { IPlayer } from "@/models/player";

export const isPlayerInRange = ({ 
  actionPlayer, 
  targetPlayer,
}: { 
  actionPlayer: IPlayer; 
  targetPlayer: IPlayer;
}) => {
  const range = actionPlayer.range;

  const xDistance = Math.abs(targetPlayer.position.x - actionPlayer.position.x);
  const yDistance = Math.abs(targetPlayer.position.y - actionPlayer.position.y);

  const isPlayerInRange = (range >= xDistance) && (range >= yDistance);

  return isPlayerInRange;
};
