<script lang="ts">
  import { Theme } from "@/theme";
  import { type Card } from "@/game/types/card";

  type PropType = {
    card: Card;
    hoverable?: boolean;
  };
  const props: PropType = $props();
</script>

<div
  class="card-border"
  class:hoverable={props.hoverable}
  style:--border-color={Theme.Surface0}
>
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
  .hoverable {
    transition: 0.3s;
    &:hover {
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.6);
    }
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
        width: 25px;
      }
    }
  }
</style>
