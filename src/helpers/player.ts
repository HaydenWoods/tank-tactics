import { IPlayer, IPlayerDocument } from "@/models/player";
import { PlayerStatus } from "@/types/player";

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

  const isPlayerInRange = range >= xDistance && range >= yDistance;

  return isPlayerInRange;
};

export const isPlayerAlive = ({ player }: { player: IPlayer }) => {
  if (player.status !== PlayerStatus.ALIVE) {
    return false;
  }
  return true;
};

export const isPlayersEqual = (
  player1: IPlayerDocument,
  player2: IPlayerDocument
) => {
  return player1._id.toString() === player2._id.toString();
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
    { title: ":map:", value: `${player.position.x}, ${player.position.y}` },
    ...(showPrivate
      ? [
          { title: ":gem:", value: `${player.actionPoints} action points` },
          { title: ":compass:", value: `${player.range} range` },
        ]
      : []),
  ];

  const playerDescription = playerInfo
    .map((item) => {
      return `${item.title}  ${item.value}`;
    })
    .join("\n");

  return playerDescription;
};
