import { ActionType, Action, ActionStatusEffects } from "./card";

export type ModifierFn = (value: Action) => Action;

function addativeModifier(value: Action, delta: number): Action {
  if (value.potency) {
    value.potency += delta;
  }
  return value;
}

function multiplicativeModifier(value: Action, delta: number): Action {
  if (value.potency) {
    value.potency *= delta;
  }
  return value;
}

function missModifier(value: Action): Action {
  value.potency = 0;
  return value;
}

function effectModifier(value: Action, effect: ActionStatusEffects): Action {
  if (!value.applyStatusEffect) value.applyStatusEffect = [];
  value.applyStatusEffect.push(effect);
  return value;
}

export enum ModifierType {
  None = "none",
  Miss = "miss",
  Additive = "additive",
  Multiplicative = "multiplicative",
  Stun = "stun",
  Burn = "burn",
  Poison = "poison",
  Weaken = "weaken",
  Strength = "strength",
}

export type Modifier = {
  type: ModifierType;
  value: number;
};

export function applyModifier(value: Action, modifier: Modifier): Action {
  switch (modifier.type) {
    case ModifierType.Miss:
      return missModifier(value);
    case ModifierType.Additive:
      return addativeModifier(value, modifier.value ?? 1);
    case ModifierType.Multiplicative:
      return multiplicativeModifier(value, modifier.value ?? 1);
    case ModifierType.Stun:
      return effectModifier(value, ActionStatusEffects.Stun);
    case ModifierType.Burn:
      return effectModifier(value, ActionStatusEffects.Burn);
    case ModifierType.Poison:
      return effectModifier(value, ActionStatusEffects.Poison);
    case ModifierType.Weaken:
      return effectModifier(value, ActionStatusEffects.Weaken);
    case ModifierType.Strength:
      return effectModifier(value, ActionStatusEffects.Strength);
    default:
    case ModifierType.None:
      return value;
  }
}

export function createModifiers(): Modifier[] {
  return [
    {
      type: ModifierType.Additive,
      value: -2,
    },
    {
      type: ModifierType.Additive,
      value: -1,
    },
    {
      type: ModifierType.Additive,
      value: 1,
    },
    {
      type: ModifierType.Additive,
      value: 2,
    },
    {
      type: ModifierType.Miss,
      value: 0,
    },
    {
      type: ModifierType.Multiplicative,
      value: 2,
    },
    ...new Array(14).fill({
      type: ModifierType.Additive,
      value: 0,
    }),
  ];
}
