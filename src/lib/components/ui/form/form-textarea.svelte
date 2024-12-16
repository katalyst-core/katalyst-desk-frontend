<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements";
	import { Textarea } from "$lib/components/ui/textarea";
	import type { WithElementRef } from 'bits-ui';
	import { cn } from "$lib/utils.js";

	let { class: className, value = $bindable(), ref = $bindable(null), ...restProps }: WithElementRef<HTMLTextareaAttributes> = $props();
</script>

<Textarea
  class={cn("data-[fs-error]:border-red-600", className)}
	bind:ref
  bind:value
  {...restProps}
/>