import { writable } from "svelte/store";
import { createModifiers } from "../types/modifiers";
import { cards as CardsData } from "./cards";
import { Character, createCharacter } from "../types/character";

export const playerStore = writable<Character>(
  createCharacter({
    position: [1, 5],
    artifacts: [],
    modifiers: createModifiers(),
    cards: [...CardsData],
    discards: [],
    display: "PLAYER",
  })
);
