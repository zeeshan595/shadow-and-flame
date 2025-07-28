import { Character } from "./character";

export enum ActionTargetType {
  Self = "self",
  Other = "other",
}

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
  BeforeAction = "before",
  AfterAction = "after",
}

export type ResourceCost = {
  resource: ActionResource;
  amount: number;
};

export type Action = {
  /**
   * If the target is Self then no range or area is needed and the action is casted on the character
   * If the target is other than the player will need to select a square
   * */
  target: ActionTargetType;
  /** The possible squares the character can select. Relative to the character */
  range?: [number, number][];
  /** The amount of cells are effected, relative to selected square */
  area?: [number, number][];
  /** The attack or healing value of a action. Healing are positive value while attacks are negative */
  potency?: number;
  /** The amount of movement to perform on the target */
  movement?: number;
  /** any status effects that should be applied to the target */
  applyStatusEffect?: ActionStatusEffects[];
  /** any resources the target should gain */
  gainResources?: ResourceCost[];
  /** summon action properties */
  summon?: Character;
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

export function createEmptyAction(): Action {
  return {
    target: ActionTargetType.Self,
  };
}
