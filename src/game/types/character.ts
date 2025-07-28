import { Artifact } from "./artifact";
import { ActionResource, ActionStatusEffects, Card } from "./card";
import { Modifier } from "./modifiers";

export type Position = {
  x: number;
  y: number;
};

export type Character = {
  // basic
  uuid: string;
  position: [number, number];

  // stats
  health: number;
  resources: Map<ActionResource, number>;
  effects: Set<ActionStatusEffects>;

  // other
  artifacts: Artifact[];
  modifiers: Modifier[];
  cards: Card[];
  discards: Card[];

  // rendering
  display: string;
};

export function createCharacter(character: Omit<Character, "uuid">): Character {
  return {
    ...character,
    uuid: crypto.randomUUID(),
  };
}
