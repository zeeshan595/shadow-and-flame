export enum ActionTargetType {
  Self = "self",
  Other = "other",
}

export enum ActionType {
  None = "none",
  Melee = "melee",
  Range = "range",
}

export type ActionSquare = {
  x: number;
  y: number;
};

export enum ActionStatusEffects {
  Stun = "stun",
  Burn = "burn",
  Poison = "poison",
  Weaken = "weaken",
  Strength = "strength",
}

export enum ActionResource {
  Stamina,
  Rage,
  Mana,
  Energy,
  Block,
}

export enum ActionMoveType {
  BeforeOrAfter = "before-or-after",
  BeforeAction = "before",
  AfterAction = "after",
}

export type ResourceCost = {
  resource: ActionResource;
  amount: number;
};

export type Action = {
  type: ActionType;
  target: ActionTargetType;
  range?: number;
  potency?: number;
  movement?: number;
  movementType?: ActionMoveType;
  effectedSquares?: ActionSquare[];
  applyStatusEffect?: ActionStatusEffects[];
  gainResources?: ResourceCost[];
};

export type Card = {
  uuid: string;
  name: string;
  description?: string;
  speed: number;
  cooldown?: number;
  resourceCost?: ResourceCost[];
  actions: Action[];
  tags?: string[];
};

export function createCard(card: Omit<Card, "uuid">): Card {
  return {
    ...card,
    uuid: crypto.randomUUID(),
  };
}
