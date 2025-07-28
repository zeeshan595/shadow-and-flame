<script lang="ts">
  import { onMount } from "svelte";
  import { resolveAction } from "./action-resolver";
  import { playerStore } from "./data/player";
  import { roundStore } from "./data/round";
  import { type Action } from "./types/card";
  import CardSelector, { waitForCardSelection } from "./card-selector.svelte";
  import Grid from "./components/grid.svelte";
  import CardAction from "./components/card-action.svelte";

  let currentAction = $state<Action | null>(null);
  async function mainLoop() {
    roundStore.update((value) => ({
      ...value,
      characters: [$playerStore],
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
      for (const action of card.actions) {
        currentAction = action;
        await resolveAction(currentAction);
      }
      currentAction = null;

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
  }

  onMount(() => {
    mainLoop();
  });
</script>

<CardSelector />
{#if currentAction !== null}
  <div class="current-action">
    {#key currentAction}
      <CardAction action={currentAction} />
    {/key}
  </div>
{/if}
<Grid />

<style>
  .current-action {
    position: absolute;
    margin-top: 20px;
  }
</style>
