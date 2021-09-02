import { IPlayer, IPlayerDocument } from "@/models/player";
import { Items, PlayerStatus } from "@/types/player";

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

export const isPlayerAlive = ({
  player,
}: {
  player: IPlayer;
}) => {
  if (player.status !== PlayerStatus.ALIVE) {
    return false;
  }
  return true;
};

export const doesPlayerHaveItem = ({
  player, 
  item,
  amount,
}: {
  player: IPlayer;
  item: Items;
  amount: number;
}) => {
  const items = player[item];

  console.log(player, items, amount);

  if (!items) {
    return false;
  }
  if (items < amount) {
    return false;
  }

  return true;
};