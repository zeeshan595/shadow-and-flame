<script lang="ts">
  import { onMount } from "svelte";
  import { windowStore } from "./game/data/window";
  import GameComponent from "./game/game.svelte";

  let container: HTMLDivElement;
  const GAME_WIDTH = 1920;
  const GAME_HEIGHT = 1080;

  onMount(() => {
    function onResize(_: UIEvent) {
      let widthRatio = window.innerWidth / GAME_WIDTH;
      let heightRatio = window.innerHeight / GAME_HEIGHT;
      const minRatio = Math.min(widthRatio, heightRatio);
      container.style.transform = `scale(${minRatio})`;

      // add current amount of padding for the black borders
      let paddingY = 0;
      let paddingX = 0;
      if (minRatio === heightRatio) {
        paddingX = Math.abs(GAME_WIDTH * minRatio - window.innerWidth) / 2;
      } else if (minRatio === widthRatio) {
        paddingY = Math.abs(GAME_HEIGHT * minRatio - window.innerHeight) / 2;
      }

      windowStore.update((value) => ({
        ...value,
        paddingY,
        paddingX,
      }));
    }
    onResize(new UIEvent("resize"));
    addEventListener("resize", onResize);
    return () => removeEventListener("resize", onResize);
  });
</script>

<div class="game-container" bind:this={container}>
  <GameComponent />
</div>

<style>
  .game-container {
    background-color: white;
    position: absolute;
    /* width */
    width: 1920px;
    min-width: 1920px;
    max-width: 1920px;
    /* height */
    height: 1080px;
    min-height: 1080px;
    max-height: 1080px;
  }
</style>
