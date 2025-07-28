import { Artifact } from "./artifact";
import { Card } from "./card";
import { Modifier } from "./modifiers";

export type Position = {
  x: number;
  y: number;
};

export type Character = {
  uuid: string;
  position: [number, number];
  artifacts: Artifact[];
  modifiers: Modifier[];
  cards: Card[];
  discards: Card[];
  display: string;
};

export function createCharacter(character: Omit<Character, "uuid">): Character {
  return {
    ...character,
    uuid: crypto.randomUUID(),
  };
}
