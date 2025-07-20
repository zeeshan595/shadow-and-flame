<script lang="ts">
  import { Theme } from "@/theme";
  import ConvexWrapper from "./ui/convex-wrapper.svelte";
</script>

<div class="card-border" style:--border-color={Theme.Surface0}>
  <div class="card" style:--background-color={Theme.Teal}>
    <div class="top">
      <div class="name">Slash</div>
      <ConvexWrapper position="top-right">
        <div class="speed">30</div>
      </ConvexWrapper>
    </div>
    <div class="bottom">
      <ConvexWrapper position="bottom-left">
        <div class="resources">
          {#each new Array(2).fill(0).map((_, i) => i) as i}
            <div
              class="resource"
              style:--resource-color={Theme.Rosewater}
            ></div>
          {/each}
        </div>
      </ConvexWrapper>
      <div class="actions">
        <div class="action">Move 2</div>
        <div class="action">Attack 2</div>
      </div>
    </div>
  </div>
</div>

<style>
  div {
    display: flex;
  }
  .card-border {
    margin: 1rem;

    background-color: var(--border-color);
    padding: 10px;
    border-radius: 20px;
  }
  .card {
    font-size: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 200px;
    height: 300px;

    background-color: var(--background-color);
    border-radius: 20px;

    .top {
      display: flex;
      flex-direction: row;
      width: calc(100%- 40px);
      padding-left: 20px;

      .name {
        flex-grow: 1;
        padding-top: 20px;
      }
      .speed {
        background-color: var(--border-color);
        color: white;
        border-bottom-left-radius: 35px;
        padding: 20px;
        position: relative;
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
        align-items: end;
        gap: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
      }

      .resources {
        display: flex;
        flex-direction: column;
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
