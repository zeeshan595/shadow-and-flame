<script lang="ts" module>
  export function waitForCardSelection(): Promise<Card> {
    let roundStoreValue = get(roundStore);
    roundStore.set({
      ...roundStoreValue,
      showCardSelector: true,
      selectedCard: null,
    });
    return new Promise((resolve) => {
      function waitForSelection() {
        roundStoreValue = get(roundStore);
        if (roundStoreValue.selectedCard) {
          resolve(roundStoreValue.selectedCard);
          roundStore.set({
            ...roundStoreValue,
            showCardSelector: false,
          });
        } else {
          setTimeout(waitForSelection, 100);
        }
      }
      waitForSelection();
    });
  }
</script>

<script lang="ts">
  import { ActionResource, type Card } from "@/game/types/card";
  import { Theme } from "@/theme";
  import { onMount } from "svelte";
  import { playerStore } from "./data/player";
  import { get } from "svelte/store";
  import { roundStore } from "./data/round";
  import CardSmallComponent from "./components/card-small.svelte";
  import CardComponent from "./components/card.svelte";
  import { windowStore } from "./data/window";

  const sortedCards = $derived(
    $playerStore.cards.sort((a, b) => a.name.localeCompare(b.name))
  );
  const sortedDiscards = $derived(
    $playerStore.discards.sort((a, b) => a.name.localeCompare(b.name))
  );
  let selectedCard = $state<Card | null>(null);
  let tooltipRef: HTMLDivElement | null = null;
  let showSelectedCard = $state(false);
  let selectedCardIsDiscarded = $state(false);

  function onMouseEnter(card: Card, isDiscarded: boolean = false) {
    selectedCard = card;
    showSelectedCard = true;
    selectedCardIsDiscarded = isDiscarded;
  }
  function onMouseLeave() {
    showSelectedCard = false;
  }
  function onMouseMove(e: MouseEvent) {
    if (!tooltipRef) return;
    if (!showSelectedCard) return;
    tooltipRef.style.top = `${e.clientY - $windowStore.paddingY}px`;
  }
  function playerHasResources(card: Card): boolean {
    if (!card.resourceCost) return true;
    for (const cost of card.resourceCost) {
      const playerResource = $playerStore.resources.get(cost.resource);
      if (!playerResource) return false;
      if (playerResource < cost.amount) return false;
    }
    return true;
  }
  function onMouseClick() {
    if (!selectedCard) return;
    if (!playerHasResources(selectedCard)) return;
    $roundStore.selectedCard = selectedCard;
    selectedCard = null;
  }

  onMount(() => {
    addEventListener("mousemove", (e) => onMouseMove(e));
    return () => {
      removeEventListener("mousemove", (e) => onMouseMove(e));
    };
  });
</script>

{#if $roundStore.showCardSelector}
  <div class="hand">
    {#each sortedCards.sort() as card}
      <button
        class="active"
        class:need-resources={!playerHasResources(card)}
        style:--border-color={Theme.Surface0}
        style:--background-color={Theme.Teal}
        onmouseenter={() => onMouseEnter(card)}
        onmouseleave={() => onMouseLeave()}
        onclick={() => onMouseClick()}
      >
        <CardSmallComponent hoverable {card} />
      </button>
    {/each}
    {#if sortedDiscards.length > 0}
      <div class="seperator"></div>
      {#each sortedDiscards as card}
        <div
          class="discard"
          style:--border-color={Theme.Surface0}
          style:--background-color={Theme.Teal}
          onmouseenter={() => onMouseEnter(card, true)}
          onmouseleave={() => onMouseLeave()}
          role="tooltip"
        >
          <CardSmallComponent {card} />
        </div>
      {/each}
    {/if}
  </div>
{/if}
<div
  bind:this={tooltipRef}
  class="card-tooltip"
  class:discarded={selectedCardIsDiscarded}
  style:opacity={showSelectedCard ? 1 : 0}
>
  {#if selectedCard}
    <CardComponent card={selectedCard} />
  {/if}
</div>

<style>
  .hand {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 0;
    left: 0;
    height: 100%;

    margin-top: 20px;
    margin-left: 10px;
    padding-right: 5px;

    gap: 2px;

    overflow-y: auto;

    button {
      background-color: transparent;
      border: 0;
      padding: 0;
      cursor: pointer;
    }

    .active,
    .discard {
      width: 100%;
    }

    .need-resources {
      filter: brightness(0.8) saturate(0.3) sepia(0.1);
    }

    .discard {
      filter: grayscale(1);
      cursor: default;
    }
    .seperator {
      border-bottom: 1px solid rgba(0, 0, 0, 0.3);
      padding-top: 5px;
      margin-bottom: 5px;
    }
  }
  .card-tooltip {
    display: block;
    position: absolute;
    width: max-content;
    transition: 0.3s;
    top: 0;
    left: 220px;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.6);
    border-radius: 20px;
    pointer-events: none;

    &.discarded {
      filter: grayscale(1);
    }
  }
</style>
