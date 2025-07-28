import {
  ActionResource,
  ActionStatusEffects,
  ActionTargetType,
  Card,
  createCard,
} from "../types/card";

export const cards: Card[] = [
  createCard({
    name: "Slash",
    speed: 30,
    actions: [
      {
        target: ActionTargetType.Other,
        potency: 2,
        range: [
          [0, 1],
          [1, 0],
          [0, -1],
          [-1, 0],
        ],
      },
      {
        target: ActionTargetType.Self,
        movement: 2,
      },
    ],
  }),
  createCard({
    name: "Rage",
    speed: 10,
    cooldown: 1,
    actions: [
      {
        target: ActionTargetType.Self,
        gainResources: [
          {
            resource: ActionResource.Block,
            amount: 2,
          },
          {
            resource: ActionResource.Rage,
            amount: 1,
          },
        ],
      },
    ],
  }),
  createCard({
    name: "Charge",
    speed: 15,
    cooldown: 2,
    actions: [
      {
        target: ActionTargetType.Self,
        movement: 5,
      },
    ],
  }),
  createCard({
    name: "Slam",
    speed: 70,
    cooldown: 3,
    actions: [
      {
        target: ActionTargetType.Other,
        applyStatusEffect: [ActionStatusEffects.Stun],
        potency: 4,
        range: [
          [0, 1],
          [1, 0],
          [0, -1],
          [-1, 0],
        ],
      },
      {
        target: ActionTargetType.Self,
        movement: 2,
      },
    ],
  }),
];
