<script lang="ts">
  import { Theme } from "@/theme";
  import { type Card, type Action, ActionResource } from "@/game/types/card";
  import ConvexWrapperComponent from "./convex-wrapper.svelte";
  import CardActionText from "./card-action-text.svelte";

  type PropType = {
    card: Card;
  };
  const props: PropType = $props();

  function getResourceColor(resource: ActionResource): string {
    switch (resource) {
      case ActionResource.Stamina:
        return Theme.Yellow;
      case ActionResource.Rage:
        return Theme.Red;
      case ActionResource.Mana:
        return Theme.Blue;
      case ActionResource.Energy:
        return Theme.Green;
      case ActionResource.Block:
        return Theme.Base;
      default:
        return Theme.Rosewater;
    }
  }
</script>

{#snippet actionSnippet(action: Action)}
  <CardActionText {action} />
{/snippet}

<div class="card-border" style:--border-color={Theme.Surface0}>
  <div
    class="card"
    style:--background-color={Theme.Teal}
    style:--text-color={Theme.Base}
  >
    <div class="top">
      <div class="name">{props.card.name}</div>
      <ConvexWrapperComponent position="top-right">
        <div class="speed" style:--text-color={Theme.Rosewater}>
          {props.card.speed}
        </div>
      </ConvexWrapperComponent>
    </div>
    <div class="bottom">
      {#if props.card.resourceCost || props.card.cooldown}
        <ConvexWrapperComponent position="bottom-left">
          <div class="resources">
            <div class="cooldown" style:--text-color={Theme.Rosewater}>
              {props.card.cooldown}
            </div>
            {#if props.card.resourceCost}
              {#each props.card.resourceCost as resourceCost}
                {#each new Array(resourceCost.amount).fill(0) as _}
                  <div
                    class="resource"
                    style:--resource-color={getResourceColor(
                      resourceCost.resource
                    )}
                  ></div>
                {/each}
              {/each}
            {/if}
          </div>
        </ConvexWrapperComponent>
      {/if}
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
    min-width: 240px;
    min-height: 300px;
  }
  .card {
    font-size: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 240px;
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
        padding-top: 18px;
        color: var(--text-color);
      }
      .speed {
        background-color: var(--border-color);
        color: var(--text-color);
        border-bottom-left-radius: 35px;
        padding: 20px;
        position: relative;
        font-weight: bold;
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
      }

      .resources {
        display: flex;
        flex-direction: column-reverse;
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

        .cooldown {
          color: var(--text-color);
          font-weight: bold;
        }
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
