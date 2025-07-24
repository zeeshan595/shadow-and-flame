import {
  ActionResource,
  ActionStatusEffects,
  ActionTargetType,
  ActionType,
  Card,
  createCard,
} from "../types/card";

export const cards: Card[] = [
  createCard({
    name: "Slash",
    speed: 30,
    actions: [
      {
        type: ActionType.Melee,
        target: ActionTargetType.Other,
        potency: 2,
        range: 1,
      },
      {
        type: ActionType.None,
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
        type: ActionType.None,
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
        type: ActionType.None,
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
        type: ActionType.Melee,
        target: ActionTargetType.Other,
        applyStatusEffect: [ActionStatusEffects.Stun],
        potency: 4,
        range: 1,
      },
      {
        type: ActionType.None,
        target: ActionTargetType.Self,
        movement: 2,
      },
    ],
  }),
];
