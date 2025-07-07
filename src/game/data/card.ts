export enum Effect {
  None = 'none',
  Stun = "stun",
  Burn = "burn",
  Poison = "poison",
  Weaken = "weaken",
  Strength = "strength",
  invisibility = "invisibility",
};

export enum ActionType {
  Move = "move",
  Attack = "attack",
  Heal = "heal",
};

export type MoveAction = {
  type: ActionType.Move;
  range: number;
};

export type AttackAction = {
  type: ActionType.Attack;
  onHitEffects?: Effect[];
  range: number;
  potency: number;
};

export type HealAction = {
  type: ActionType.Heal;
  onHitEffects?: Effect[];
  range: number;
  potency: number;
};

export type ALL_ACTIONS = MoveAction | AttackAction | HealAction;

export type Card = {
  uuid: string;
  name: string;
  description: string;
  speed: number; // how quickly you can act this turn
  actions: ALL_ACTIONS[];
  tags: string[];
};

export const exampleCard: Card = {
  uuid: crypto.randomUUID(),
  name: 'Slash',
  description: 'Do a basic sword attack',
  speed: 30,
  actions: [
    {
      type: ActionType.Move,
      range: 2
    },
    {
      type: ActionType.Attack,
      range: 1,
      potency: 2,
    }
  ],
  tags: []
};
