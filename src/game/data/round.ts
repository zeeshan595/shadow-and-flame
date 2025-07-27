import { writable } from "svelte/store";
import { Action, Card } from "../types/card";

export const roundStore = writable<{
  showCardSelector: boolean;
  selectedCard: Card | null;
  showActionSelector: boolean;
  selectedAction: Action | null;
  gridHighlights: [number, number][];
  gridContent: [number, number, string][];
  selectedCell: [number, number] | null;
}>({
  showCardSelector: false,
  selectedCard: null,
  showActionSelector: false,
  selectedAction: null,
  gridHighlights: [],
  gridContent: [],
  selectedCell: null,
});
