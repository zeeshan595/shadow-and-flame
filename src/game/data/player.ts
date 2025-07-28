import { writable } from "svelte/store";
import { createModifiers } from "../types/modifiers";
import { cards as CardsData } from "./cards";
import { Character, createCharacter } from "../types/character";
import { ActionResource } from "../types/card";

export const playerStore = writable<Character>(
  createCharacter({
    position: [1, 5],
    health: 10,
    resources: new Map([
      [ActionResource.Block, 0],
      [ActionResource.Energy, 0],
      [ActionResource.Mana, 0],
      [ActionResource.Rage, 0],
      [ActionResource.Stamina, 0],
    ]),
    effects: new Set(),
    artifacts: [],
    modifiers: createModifiers(),
    cards: [...CardsData],
    discards: [],
    display: "PLAYER",
  })
);
