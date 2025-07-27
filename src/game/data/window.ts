import { writable } from "svelte/store";

export const windowStore = writable({
  paddingY: 0,
  paddingX: 0,
});
