import { Artifact } from "./artifact";
import { Card, exampleCard } from "./card";
import { Modifier, ModifierType } from './modifiers';

export type Character = {
  uuid: string;
  name: string;
  description: string;
  artifacts: Artifact[];
  modifiers: Modifier[];
  cards: Card[];
};

export const exampleCharacter: Character = {
  uuid: crypto.randomUUID(),
  name: 'Example Character',
  description: 'This is an example character',
  artifacts: [],
  modifiers: [
    {
      type: ModifierType.Additive,
      value: -2
    },
    {
      type: ModifierType.Additive,
      value: -1
    },
    {
      type: ModifierType.Additive,
      value: 1
    },
    {
      type: ModifierType.Additive,
      value: 2
    },
    {
      type: ModifierType.Miss,
      value: 0
    },
    {
      type: ModifierType.Multiplicative,
      value: 2
    },
    ...new Array(14).fill({
      type: ModifierType.Additive,
      value: 0
    }),
  ],
  cards: new Array(10).fill(exampleCard),
};