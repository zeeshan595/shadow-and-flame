<script lang="ts">
  import { type Card as CardType } from "@/game/types/card";
  import { Theme } from "@/theme";
  import { onMount } from "svelte";
  import CardSmall from "./card-small.svelte";
  import Card from "./card.svelte";

  type PropType = {
    hand: CardType[];
    discard: CardType[];
  };
  const props: PropType = $props();

  let showSelectedCard = $state(false);
  let selectedCard = $state<CardType | null>(null);
  let tooltipRef: HTMLDivElement | null = null;

  function onMouseEnter(card: CardType) {
    selectedCard = card;
    showSelectedCard = true;
  }
  function onMouseLeave(_: CardType) {
    showSelectedCard = false;
  }
  function onMouseMove(e: MouseEvent) {
    if (!tooltipRef) return;
    if (!showSelectedCard) return;
    tooltipRef.style.top = `${e.clientY}px`;
  }

  onMount(() => {
    addEventListener("mousemove", (e) => onMouseMove(e));
    return () => {
      removeEventListener("mousemove", (e) => onMouseMove(e));
    };
  });
</script>

<div class="hand">
  {#each props.hand as card}
    <div
      class="active"
      style:--border-color={Theme.Surface0}
      style:--background-color={Theme.Teal}
      onmouseenter={() => onMouseEnter(card)}
      onmouseleave={() => onMouseLeave(card)}
      role="tooltip"
    >
      <CardSmall {card} />
    </div>
  {/each}
  {#if props.discard.length > 0}
    <div class="seperator"></div>
    {#each props.discard as card}
      <div
        class="discard"
        style:--border-color={Theme.Surface0}
        style:--background-color={Theme.Teal}
        onmouseenter={() => onMouseEnter(card)}
        onmouseleave={() => onMouseLeave(card)}
        role="tooltip"
      >
        <CardSmall {card} />
      </div>
    {/each}
  {/if}
</div>
<div
  bind:this={tooltipRef}
  class="card-tooltip"
  style:opacity={showSelectedCard ? 1 : 0}
>
  {#if selectedCard}
    <Card card={selectedCard} />
  {/if}
</div>

<style>
  .hand {
    position: fixed;
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
    cursor: pointer;

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
  }
</style>
