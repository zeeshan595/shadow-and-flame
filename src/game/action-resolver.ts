import { ActionTargetType, type Action } from "./types/card";
import { waitForCellSelection } from "./components/grid.svelte";
import { playerStore } from "./data/player";
import { get } from "svelte/store";

function getMoveSquaresInRange(
  range: number,
  currentPosition: [number, number]
) {
  const squares: [number, number][] = [];
  const [x, y] = currentPosition;
  for (let i = x - range; i <= x + range; i++) {
    for (let j = y - range; j <= y + range; j++) {
      if (Math.abs(x - i) + Math.abs(y - j) > range) continue;
      squares.push([i, j]);
    }
  }
  return squares;
}

function getSquaresInRange(
  range: number,
  currentPosition: [number, number]
): [number, number][] {
  const squares: [number, number][] = [];
  const [x, y] = currentPosition;
  for (let i = x - range; i <= x + range; i++) {
    for (let j = y - range; j <= y + range; j++) {
      if (Math.abs(x - i) + Math.abs(y - j) > range) continue;
      squares.push([i, j]);
    }
  }
  return squares;
}

export async function resolveAction(action: Action) {
  if (action.movement && action.moveBeforeActionResolution) {
    await resolveMovementAction(action);
  }

  if (action.potency && action.potency !== 0) {
    // get action target
    if (action.target !== ActionTargetType.Self) {
      const selectedCell = await waitForCellSelection(
        getSquaresInRange(action.range ?? 1, get(playerStore).position)
      );
      //todo: select target based on cell
    } else {
      //todo: select self as target
    }

    // todo: perform action on target
  }

  if (action.movement && !action.moveBeforeActionResolution) {
    await resolveMovementAction(action);
  }
}

async function resolveMovementAction(action: Action) {
  const player = get(playerStore);
  const updatedPlayerPosition = await waitForCellSelection(
    getMoveSquaresInRange(action.movement ?? 0, player.position)
  );
  playerStore.set({
    ...player,
    position: updatedPlayerPosition,
  });
}
