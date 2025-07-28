<script lang="ts" module>
  import { get } from "svelte/store";

  export async function waitForCellSelection(
    highlightedSquares: [number, number][]
  ): Promise<[number, number]> {
    roundStore.update((value) => ({
      ...value,
      gridHighlights: highlightedSquares,
      selectedCell: null,
    }));
    let roundStoreValue = get(roundStore);
    return new Promise((resolve, reject) => {
      function waitForSelection() {
        roundStoreValue = get(roundStore);
        if (roundStoreValue.selectedCell) {
          resolve([...roundStoreValue.selectedCell]);
          roundStore.update((value) => ({
            ...value,
            gridHighlights: [],
            selectedCell: null,
          }));
        } else {
          setTimeout(waitForSelection, 100);
        }
      }
      waitForSelection();
    });
  }
</script>

<script lang="ts">
  import { roundStore } from "../data/round";

  const GRID_WIDTH = 15;
  const GRID_HEIGHT = 10;

  function onClick(x: number, y: number) {
    roundStore.set({
      ...$roundStore,
      selectedCell: [x, y],
    });
  }

  // creates reactive grid data
  const gridData = $derived.by(() => {
    return new Array(GRID_HEIGHT).fill(0).map((_, y) => {
      return new Array(GRID_WIDTH).fill(0).map((_, x) => {
        const cellContent = $roundStore.characters.find(
          (c) => c.position[0] === x && c.position[1] === y
        );
        const content = cellContent ? cellContent.display : null;

        const isHighlighted = !!$roundStore.gridHighlights.find(
          (h) => h[0] === x && h[1] === y
        );
        return {
          content,
          isHighlighted,
          x,
          y,
        };
      });
    });
  });
</script>

<div class="grid">
  {#each gridData as row}
    <div class="row">
      {#each row as cell}
        <button
          class="cell"
          class:highlight={cell.isHighlighted}
          onclick={() => onClick(cell.x, cell.y)}
        >
          {cell.content}
        </button>
      {/each}
    </div>
  {/each}
</div>

<style>
  .grid {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-left: 250px;
    width: calc(100% - 250px);
    height: 100%;
    justify-content: center;
    align-items: center;

    .row {
      display: flex;
      gap: 5px;

      .cell {
        display: flex;
        width: 100px;
        height: 100px;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.7);
        transition: 0.5s;
        cursor: pointer;
        justify-content: center;
        align-items: center;

        /* todo: remove color and font-size */
        color: red;
        font-size: 18px;

        &.highlight {
          background-color: rgba(0, 0, 0, 0.3);
        }

        &:hover {
          background-color: rgba(0, 0, 0, 0.9);
        }
      }
    }
  }
</style>
