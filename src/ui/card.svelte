<script lang="ts">
  import { Theme } from "@/theme";
  import {
    ActionType,
    type Card,
    type Action,
    ActionResource,
  } from "@/game/types/card";
  import ConvexWrapper from "./convex-wrapper.svelte";

  type PropType = {
    card: Card;
  };
  const props: PropType = $props();
</script>

{#snippet actionSnippet(action: Action)}
  <div class="action">
    {#if action.potency}
      <span class="potency">
        {#if action.potency >= 0}
          Attack {action.potency}
        {:else}
          Heal {action.potency}
        {/if}
      </span>
    {/if}
    {#if action.range}
      <span class="range">
        Range {action.range}
      </span>
    {/if}
    {#if action.applyStatusEffect}
      {#each action.applyStatusEffect as effect}
        <span class="effect">
          {effect}
        </span>
      {/each}
    {/if}
    {#if action.gainResources}
      {#each action.gainResources as resource}
        <span class="resource">
          {ActionResource[resource.resource]}
          {resource.amount}
        </span>
      {/each}
    {/if}
    {#if action.movement}
      <span class="move">
        Move {action.movement}
      </span>
    {/if}
  </div>
{/snippet}

<div class="card-border" style:--border-color={Theme.Surface0}>
  <div
    class="card"
    style:--background-color={Theme.Teal}
    style:--text-color={Theme.Base}
  >
    <div class="top">
      <div class="name">{props.card.name}</div>
      <ConvexWrapper position="top-right">
        <div class="speed">{props.card.speed}</div>
      </ConvexWrapper>
    </div>
    <div class="bottom">
      <ConvexWrapper position="bottom-left">
        <div class="resources">
          {#each new Array(2).fill(0).map((_, i) => i) as i}
            <div
              class="resource"
              style:--resource-color={Theme.Rosewater}
            ></div>
          {/each}
        </div>
      </ConvexWrapper>
      <div class="actions">
        {#each props.card.actions as action}
          {@render actionSnippet(action)}
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  div {
    display: flex;
  }
  .card-border {
    background-color: var(--border-color);
    padding: 10px;
    border-radius: 20px;
    min-width: 200px;
    min-height: 300px;
  }
  .card {
    font-size: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 200px;
    min-height: 300px;

    background-color: var(--background-color);
    border-radius: 20px;

    .top {
      display: flex;
      flex-direction: row;
      width: calc(100%- 40px);
      padding-left: 20px;

      .name {
        flex-grow: 1;
        padding-top: 20px;
        color: var(--text-color);
      }
      .speed {
        background-color: var(--border-color);
        color: white;
        border-bottom-left-radius: 35px;
        padding: 20px;
        position: relative;
      }
    }
    .bottom {
      display: flex;
      flex-direction: row;
      flex-grow: 1;
      justify-content: end;
      align-items: end;
      position: relative;

      .actions {
        flex-grow: 1;
        flex-direction: column;
        justify-content: end;
        align-items: last baseline;
        gap: 20px;
        padding-right: 20px;
        padding-bottom: 20px;

        .action {
          flex-direction: column;

          .potency,
          .move {
            font-size: 20px;
            color: var(--text-color);
          }
          .range {
            font-size: 16px;
            color: var(--text-color);
          }
          .effect {
            font-size: 12px;
            text-transform: uppercase;
            font-weight: bold;
            color: var(--text-color);
          }
        }
      }

      .resources {
        display: flex;
        flex-direction: column;
        gap: 10px;

        position: relative;
        background-color: var(--border-color);
        border-top-right-radius: 20px;
        justify-content: start;
        align-items: center;
        left: 0;
        bottom: 0;
        width: 25px;
        padding: 5px;
        padding-top: 15px;

        .resource {
          background-color: var(--resource-color);
          border-radius: 50%;
          width: 10px;
          height: 10px;
        }

        &::before,
        &::after {
          content: "";
          position: absolute;
          background-color: var(--background-color);
          width: 20px;
          height: 20px;
          z-index: 1;
        }

        &::before {
          border-bottom-left-radius: 20px;
          top: -20px;
          left: 0;
        }
        &::after {
          border-bottom-left-radius: 20px;
          bottom: 0;
          right: -20px;
        }
      }
    }
  }
</style>
