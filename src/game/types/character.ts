import { Artifact } from "./artifact";
import { Card } from "./card";
import { Modifier } from "./modifiers";

export type Character = {
  uuid: string;
  name: string;
  description: string;
  artifacts: Artifact[];
  modifiers: Modifier[];
  cards: Card[];
};

export function createCharacter(character: Omit<Character, "uuid">): Character {
  return {
    ...character,
    uuid: crypto.randomUUID(),
  };
}
