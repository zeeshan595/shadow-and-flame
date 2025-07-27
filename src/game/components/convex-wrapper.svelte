<script lang="ts">
  type PropType = {
    children: any;
    position: "top-right" | "top-left" | "bottom-left" | "bottom-right";
  };
  const props: PropType = $props();
</script>

<div
  class="convex-wrapper"
  class:top-right={props.position === "top-right"}
  class:top-left={props.position === "top-left"}
  class:bottom-right={props.position === "bottom-right"}
  class:bottom-left={props.position === "bottom-left"}
>
  <div
    class="convex-inner"
    class:top-right={props.position === "top-right"}
    class:top-left={props.position === "top-left"}
    class:bottom-right={props.position === "bottom-right"}
    class:bottom-left={props.position === "bottom-left"}
  >
    {@render props.children()}
  </div>
</div>

<style>
  .convex-wrapper {
    position: relative;

    &::before,
    &::after {
      content: "";
      position: absolute;
      background-color: var(--border-color);
      width: 20px;
      height: 20px;
    }

    &.top-right {
      &::before {
        top: 0;
        left: -20px;
      }
      &::after {
        bottom: -20px;
        right: 0;
      }
    }

    &.bottom-left {
      &::before {
        top: -20px;
        left: 0px;
      }
      &::after {
        bottom: 0;
        right: -20px;
      }
    }

    .convex-inner {
      &::before,
      &::after {
        content: "";
        position: absolute;
        background-color: var(--background-color);
        width: 20px;
        height: 20px;
        z-index: 1;
      }

      &.top-right {
        &::before {
          border-top-right-radius: 20px;
          top: 0;
          left: -20px;
        }
        &::after {
          border-top-right-radius: 20px;
          bottom: -20px;
          right: 0;
        }
      }

      &.bottom-left {
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
