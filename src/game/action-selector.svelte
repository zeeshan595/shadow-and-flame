<script lang="ts" module>
  let possibleActions = $state<Action[]>([]);
  export function waitForActionSelection(actions: Action[]): Promise<Action> {
    possibleActions = actions;
    let roundStoreValue = get(roundStore);
    roundStore.set({
      ...roundStoreValue,
      showActionSelector: true,
      selectedAction: null,
    });
    return new Promise((resolve) => {
      function waitForSelection() {
        roundStoreValue = get(roundStore);
        if (roundStoreValue.selectedAction) {
          resolve(roundStoreValue.selectedAction);
          roundStore.set({
            ...roundStoreValue,
            showActionSelector: false,
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
  import { type Action, createEmptyAction } from "./types/card";
  import { get } from "svelte/store";
  import { roundStore } from "./data/round";
  import CardAction from "./components/card-action.svelte";

  function onActionSelected(index: number) {
    $roundStore.selectedAction = possibleActions[index];
  }
  function onEndTurn() {}
</script>

{#if $roundStore.showActionSelector}
  <div class="actions">
    {#each possibleActions as action, index}
      <CardAction {action} onClick={() => onActionSelected(index)} />
    {/each}
    <CardAction
      customText={possibleActions.length === 0 ? "End" : "Skip"}
      action={createEmptyAction()}
      onClick={onEndTurn}
    />
  </div>
{/if}

<style>
  .actions {
    display: flex;
    position: absolute;
    flex-direction: column;
    margin-top: 20px;
    gap: 20px;
  }
</style>
