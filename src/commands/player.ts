import { PlayerController } from "@/controllers/player";
import { Command } from "@/types/command";

export const commands: Command[] = [
  {
    meta: {
      name: "join",
      description: "Join the game",
    },
    controller: PlayerController.join,
  },
  {
    meta: {
      name: "move",
      description: "Move your player",
      options: [
        {
          type: 3,
          name: "direction",
          description: "The direction to move",
          choices: [
            {
              name: "up",
              value: "up",
            },
            {
              name: "down",
              value: "down",
            },
            {
              name: "left",
              value: "left",
            },
            {
              name: "right",
              value: "right",
            },
          ],
          required: true,
        },
        {
          type: 4,
          name: "amount",
          description: "The amount in that direction to move",
        },
      ],
    },
    controller: PlayerController.move,
  },
  {
    meta: {
      name: "shoot",
      description: "Shoot another player",
      options: [
        {
          type: 6,
          name: "player",
          description: "The player to shoot",
          required: true,
        },
        {
          type: 4,
          name: "amount",
          description: "The amount of times to shoot",
          required: false,
        },
      ],
    },
    controller: PlayerController.shoot,
  },
  {
    meta: {
      name: "give",
      description: "Give another player an item",
      options: [
        {
          type: 6,
          name: "player",
          description: "The player to give the item to",
          required: true,
        },
        {
          type: 3,
          name: "item",
          description: "The item to give",
          choices: [
            {
              name: "Action points",
              value: "actionPoints",
            },
            {
              name: "Health",
              value: "health",
            },
          ],
          required: true,
        },
        {
          type: 4,
          name: "amount",
          description: "The amount of that item to give",
          required: true,
        },
      ],
    },
    controller: PlayerController.give,
  },
  {
    meta: {
      name: "buy",
      description: "Buy an item for your player",
      options: [
        {
          type: 3,
          name: "item",
          description: "The item to buy",
          choices: [
            {
              name: "Range",
              value: "range",
            },
            {
              name: "Health",
              value: "health",
            },
          ],
          required: true,
        },
        {
          type: 4,
          name: "amount",
          description: "The amount of that item to buy",
        },
      ],
    },
    controller: PlayerController.buy,
  },
  {
    meta: {
      name: "leave",
      description: "Leave the game",
    },
    controller: PlayerController.leave,
  },
  {
    meta: {
      name: "info",
      description: "Show another players info",
      options: [
        {
          type: 6,
          name: "player",
          description: "The player whose info to show",
          required: true,
        },
      ],
    },
    controller: PlayerController.displayInfo,
  },
  {
    meta: {
      name: "me",
      description: "Show your player info",
    },
    controller: PlayerController.displayMe,
  },
];
