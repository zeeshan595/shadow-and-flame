import { writable } from "svelte/store";
import { Artifact } from "../types/artifact";
import { createModifiers, Modifier } from "../types/modifiers";
import { Card } from "../types/card";
import { cards as CardsData } from "./cards";

export type PlayerType = {
  position: [number, number];
  artifacts: Artifact[];
  modifiers: Modifier[];
  cards: Card[];
  discards: Card[];
};
export const playerStore = writable<PlayerType>({
  position: [1, 2],
  artifacts: [],
  modifiers: createModifiers(),
  cards: [...CardsData],
  discards: [],
});
