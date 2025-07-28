import {
  ActionStatusEffects,
  ActionTargetType,
  type Action,
} from "./types/card";
import { waitForCellSelection } from "./components/grid.svelte";
import { playerStore } from "./data/player";
import { get } from "svelte/store";
import { Character } from "./types/character";
import { roundStore } from "./data/round";
import { applyModifier } from "./types/modifiers";

export async function resolveAction(action: Action) {
  const self = get(playerStore); //todo: change this

  // get action target
  let target: Character | null = null;
  if (action.target !== ActionTargetType.Self) {
    if (!action.range) {
      throw new Error("range is required for target type other");
    }
    const selectedCell = await waitForCellSelection(
      getRelativeSquares(action.range, self.position)
    );
    target = getCharacterFromPosition(get(roundStore).characters, selectedCell);
  } else {
    target = self;
  }

  // if no target then return
  if (!target) return;

  // perform action on target
  if (action.potency) {
    let isNegative = action.potency < 0;

    // get current modifier
    const modifier =
      self.modifiers[Math.floor(Math.random() * self.modifiers.length)];
    action = applyModifier(action, modifier);
    if (isNegative) {
      // do damage
      if (target.effects.has(ActionStatusEffects.Poison))
        target.health += action.potency ?? 0;
      action.potency = action.potency ?? 0 * -1;
    } else {
      // heal character
      if (target.effects.has(ActionStatusEffects.Poison))
        target.effects.delete(ActionStatusEffects.Poison);
      else target.health += action.potency ?? 0;
    }
  }
  if (action.gainResources) {
    for (const resource of action.gainResources) {
      const currentResource = target.resources.get(resource.resource) ?? 0;
      target.resources.set(
        resource.resource,
        currentResource + resource.amount
      );
    }
  }
  if (action.applyStatusEffect) {
    for (const effect of action.applyStatusEffect) {
      target.effects.add(effect);
    }
  }
  if (action.movement) {
    const newPosition = await waitForCellSelection(
      getSquaresInRange(action.movement, target.position)
    );
    target.position = newPosition;
    roundStore.update((value) => ({
      ...value,
      characters: [
        ...value.characters.filter((c) => c.uuid !== target.uuid),
        target,
      ],
    }));
  }
}

//================
//HELPER FUNCTIONS
//================
function getSquaresInRange(
  range: number,
  currentPosition: [number, number],
  countDiagnolAsTwo = true
): [number, number][] {
  const squares: [number, number][] = [];
  const [x, y] = currentPosition;
  for (let i = x - range; i <= x + range; i++) {
    for (let j = y - range; j <= y + range; j++) {
      if (countDiagnolAsTwo && Math.abs(x - i) + Math.abs(y - j) > range)
        continue;
      squares.push([i, j]);
    }
  }
  return squares;
}

function getRelativeSquares(
  squares: [number, number][],
  currentPosition: [number, number]
) {
  for (let i = 0; i < squares.length; i++) {
    squares[i][0] += currentPosition[0];
    squares[i][1] += currentPosition[1];
  }
  return squares;
}

function getCharacterFromPosition(
  characters: Character[],
  position: [number, number]
): Character | null {
  for (const character of characters) {
    if (
      character.position[0] === position[0] &&
      character.position[1] === position[1]
    ) {
      return character;
    }
  }
  return null;
}
