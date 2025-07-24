import { ActionType, ALL_ACTIONS, Effect } from "./card";

export type ModifierFn = (value: ALL_ACTIONS) => ALL_ACTIONS;

function addativeModifier(value: ALL_ACTIONS, delta: number): ALL_ACTIONS {
  if (value.type === ActionType.Move || value.type === ActionType.Resource)
    return value;
  value.potency += delta;
  return value;
}

function multiplicativeModifier(
  value: ALL_ACTIONS,
  delta: number
): ALL_ACTIONS {
  if (value.type === ActionType.Move || value.type === ActionType.Resource)
    return value;
  value.potency *= delta;
  return value;
}

function missModifier(value: ALL_ACTIONS): ALL_ACTIONS {
  if (value.type === ActionType.Move || value.type === ActionType.Resource)
    return value;
  value.potency = 0;
  return value;
}

function effectModifier(value: ALL_ACTIONS, effect: Effect): ALL_ACTIONS {
  if (value.type === ActionType.Move || value.type === ActionType.Resource)
    return value;
  if (!value.onHitEffects) value.onHitEffects = [];
  if (effect === Effect.Strength) {
    if (value.type === ActionType.Heal) {
      value.onHitEffects.push(effect);
    }
  } else {
    if (value.type === ActionType.Attack) {
      value.onHitEffects.push(effect);
    }
  }
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

export function applyModifier(
  value: ALL_ACTIONS,
  modifier: Modifier
): ALL_ACTIONS {
  switch (modifier.type) {
    case ModifierType.Miss:
      return missModifier(value);
    case ModifierType.Additive:
      return addativeModifier(value, modifier.value ?? 1);
    case ModifierType.Multiplicative:
      return multiplicativeModifier(value, modifier.value ?? 1);
    case ModifierType.Stun:
      return effectModifier(value, Effect.Stun);
    case ModifierType.Burn:
      return effectModifier(value, Effect.Burn);
    case ModifierType.Poison:
      return effectModifier(value, Effect.Poison);
    case ModifierType.Weaken:
      return effectModifier(value, Effect.Weaken);
    case ModifierType.Strength:
      return effectModifier(value, Effect.Strength);
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
