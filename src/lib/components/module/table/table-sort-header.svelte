<script lang="ts">
	import type { Snippet } from "svelte";
	import { ArrowDown } from "lucide-svelte";

  interface Props {
    order: string | undefined;
    toggle: ((ev: unknown) => void) | undefined;
    children: Snippet;
  }

  let { order, toggle, children }: Props = $props();
</script>

<button
  onclick={toggle}
  class="flex items-center gap-1"
>
  {@render children()}
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