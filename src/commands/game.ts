import { GameController } from "@/controllers/game";

import { Command } from "@/types/command";

export const commands: Command[] = [
  {
    meta: {
      name: "create",
      description: "Create a new game",
    },
    controller: GameController.create,
  },
  {
    meta: {
      name: "start",
      description: "Start the game, only able to be executed during game setup",
    },
    controller: GameController.start,
  },
  {
    meta: {
      name: "cancel",
      description: "Cancel the game",
    },
    controller: GameController.cancel,
  },
  {
    meta: {
      name: "join",
      description: "Join the game",
      options: [
        {
          type: 3,
          name: "emoji",
          description: "The emoji for your player",
          required: true,
        },
      ],
    },
    controller: GameController.join,
  },
  {
    meta: {
      name: "leave",
      description: "Leave the game",
    },
    controller: GameController.leave,
  },
  {
    meta: {
      name: "add",
      description:
        "Add a new player to the game, only able to be executed during game setup",
      options: [
        {
          type: 6,
          name: "player",
          description: "The player to add",
          required: true,
        },
        {
          type: 3,
          name: "emoji",
          description: "The players emoji",
          required: true,
        },
      ],
    },
    controller: GameController.addPlayer,
  },
  {
    meta: {
      name: "remove",
      description:
        "Remove a player from the game, only able to be executed during game setup",
      options: [
        {
          type: 6,
          name: "player",
          description: "The player to remove",
          required: true,
        },
      ],
    },
    controller: GameController.removePlayer,
  },
  {
    meta: {
      name: "board",
      description:
        "Show the board to all players. Contains limited player info and positions",
    },
    controller: GameController.displayBoard,
  },
];
