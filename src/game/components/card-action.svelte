<script lang="ts">
  import { ActionResource, type Action } from "@/game/types/card";
  import { Theme } from "@/theme";

  type PropType = {
    customText?: string;
    action: Action;
    onClick?: () => void;
  };
  const props: PropType = $props();
  const action = props.action;
</script>

<button
  class="action-border"
  style:--border-color={Theme.Surface0}
  onclick={props.onClick}
>
  <div class="action" style:--background-color={Theme.Teal}>
    {#if props.customText}
      {props.customText}
    {/if}
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
</button>

<style>
  .action-border {
    background-color: var(--border-color);
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    padding: 5px;
    cursor: pointer;
    transition: 0.3s;
    border: 0;
    margin: 0;

    &:hover {
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.6);
    }
  }

  .action {
    display: flex;
    flex-direction: column;
    background-color: var(--background-color);
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    padding: 10px;
    gap: 10px;

    div {
      display: flex;
    }
  }
</style>
