<script lang="ts">
  import { type Action } from "@/game/types/card";
  import { Theme } from "@/theme";
  import CardActionText from "./card-action-text.svelte";

  type PropType = {
    action: Action;
  };
  const props: PropType = $props();
</script>

<button class="action-border" style:--border-color={Theme.Surface0}>
  <div class="action" style:--background-color={Theme.Teal}>
    <CardActionText action={props.action} />
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
  }
</style>
