<script lang="ts">
	import { ArrowDown } from "lucide-svelte";

  export let label: string;
  export let order: string | undefined;
  export let toggle: (ev: Event) => void;
</script>

<button
  on:click={toggle}
  class="flex items-center gap-1"
>
  <span
    class="font-semibold"
  >
    {label}
  </span>
  <ArrowDown
    class="
      w-4
      h-4
      transition-transform
      duration-75
      {order ? 'visible' : 'invisible'}
      {order === 'desc' ? 'rotate-180' : 'rotate-0'}
    "
  />
</button>