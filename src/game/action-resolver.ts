import { type Action, ActionMoveType } from "./types/card";
import { waitForCellSelection } from "./components/grid.svelte";
import { playerStore } from "./data/player";
import { get } from "svelte/store";

export function getMoveSquaresInRange(
  range: number,
  playerPosition: [number, number]
) {
  const squares: [number, number][] = [];
  const [x, y] = playerPosition;
  for (let i = x - range; i <= x + range; i++) {
    for (let j = y - range; j <= y + range; j++) {
      if (Math.abs(x - i) + Math.abs(y - j) > range) continue;
      squares.push([i, j]);
    }
  }
  return squares;
}

export async function resolveAction(action: Action) {
  if (action.movement && action.movementType === ActionMoveType.BeforeAction) {
    await resolveMovementAction(action);
  }

  if (
    action.movement &&
    (!action.movementType || action.movementType === ActionMoveType.AfterAction)
  ) {
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
