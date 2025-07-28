<script lang="ts">
  import { onMount } from "svelte";
  import ActionSelector, {
    waitForActionSelection,
  } from "./action-selector.svelte";
  import { resolveAction } from "./action-resolver";
  import { playerStore } from "./data/player";
  import CardSelector, { waitForCardSelection } from "./card-selector.svelte";
  import Grid from "./components/grid.svelte";
  import { roundStore } from "./data/round";
  import { get } from "svelte/store";

  onMount(async () => {
    roundStore.update((value) => ({
      ...value,
      characters: [() => $playerStore],
    }));
    let roundNumber = 0;
    let cardsOnCooldown = new Map<string, number>();
    while (true) {
      // on round start
      for (const card of cardsOnCooldown) {
        if (roundNumber < card[1]) continue;
        playerStore.update((value) => {
          const cardValue = value.discards.find((c) => c.uuid === card[0]);
          if (!cardValue) return value;
          value.cards = [...value.cards, cardValue];
          value.discards = value.discards.filter(
            (c) => c.uuid !== cardValue.uuid
          );
          return value;
        });
        cardsOnCooldown.delete(card[0]);
      }

      const card = await waitForCardSelection();
      let actionsToResolve = new Set([...card.actions]);
      while (actionsToResolve.size > 0) {
        const action = await waitForActionSelection([...actionsToResolve]);
        if (!action) {
          break;
        }
        await resolveAction(action);
        actionsToResolve.delete(action);
      }

      // on round end
      if (card.cooldown !== 0) {
        playerStore.update((value) => {
          value.cards = value.cards.filter((c) => c.uuid !== card.uuid);
          value.discards = [...value.discards, card];
          return value;
        });
        if (card.cooldown && card.cooldown > 0) {
          cardsOnCooldown.set(card.uuid, roundNumber + card.cooldown);
        }
      }
      roundNumber++;
    }
  });
</script>

<CardSelector />
<ActionSelector />
<Grid />
