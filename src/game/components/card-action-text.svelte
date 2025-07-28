<script lang="ts">
  import { Theme } from "@/theme";
  import { ActionResource, type Action } from "../types/card";

  const { action }: { action: Action } = $props();
</script>

<div class="container" style:--text-color={Theme.Surface0}>
  {#if action.potency}
    <div class="potency">
      {#if action.potency >= 0}
        Attack {action.potency}
      {:else}
        Heal {action.potency}
      {/if}
    </div>
  {/if}
  {#if action.range}
    <div class="range">
      Range {action.range}
    </div>
  {/if}
  {#if action.applyStatusEffect}
    {#each action.applyStatusEffect as effect}
      <div class="effect">
        {effect}
      </div>
    {/each}
  {/if}
  {#if action.gainResources}
    {#each action.gainResources as resource}
      <div class="resource">
        {ActionResource[resource.resource]}
        {resource.amount}
      </div>
    {/each}
  {/if}
  {#if action.movement}
    <div class="move">
      Move {action.movement}
    </div>
  {/if}
</div>

<style>
  div {
    display: flex;
  }
  .container {
    flex-direction: column;
    gap: 10px;

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
</style>
