<script lang="ts">
  import { type Card } from "./game/types/card";
  import { cards } from "./game/data/cards";
  import Hand from "./ui/hand.svelte";
</script>

<Hand hand={cards} discard={[]} />
