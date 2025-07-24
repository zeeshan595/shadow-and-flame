<script lang="ts">
  import { Theme } from "@/theme";
  import { ActionType, type Card } from "@/game/types/card";

  type PropType = {
    card: Card;
  };
  const props: PropType = $props();
</script>

<div class="card-border" style:--border-color={Theme.Surface0}>
  <div
    class="card"
    style:--background-color={Theme.Teal}
    style:--text-color={Theme.Base}
  >
    <div class="top">
      <div class="name">{props.card.name}</div>
      <div class="speed">{props.card.speed}</div>
    </div>
  </div>
</div>

<style>
  div {
    display: flex;
  }
  .card-border {
    background-color: var(--border-color);
    padding: 3px;
    border-radius: 20px;
    min-width: 200px;
  }
  .card {
    font-size: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 200px;
    flex-grow: 1;

    background-color: var(--background-color);
    border-radius: 20px;

    .top {
      display: flex;
      flex-direction: row;
      width: calc(100%- 40px);
      padding-left: 10px;

      .name {
        flex-grow: 1;
        color: var(--text-color);
      }
      .speed {
        background-color: var(--border-color);
        color: white;
        position: relative;
        padding-left: 10px;
        padding-right: 10px;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
      }
    }
  }
</style>
