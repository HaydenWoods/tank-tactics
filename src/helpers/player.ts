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

export const isPlayersEqual = (
  player1: IPlayerDocument, 
  player2: IPlayerDocument,
) => {
  return player1._id.toString() === player2._id.toString();
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

export const getPlayerDescription = ({ 
  player,
  showPrivate = false,
}: { 
  player: IPlayer;
  showPrivate?: boolean;
}) => {
  const playerInfo = [
    { title: ":heart:", value: `${player.health} hearts` },
    { title: ":compass:", value: `${player.range} range` },
    { title: ":map:", value: `${player.position.x} : ${player.position.y}` },
    ...(showPrivate ? [
      { title: ":gem:", value: `${player.actionPoints} action points` }
    ] : []),
  ];

  const playerDescription = playerInfo.map((item) => {
    return `${item.title} ${item.value}`;
  }).join("\n");

  return playerDescription;
};