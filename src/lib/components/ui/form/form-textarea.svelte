<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements";
	import { getFormControl } from "formsnap";
	import { Textarea } from "$lib/components/ui/textarea";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLTextareaAttributes;

	let className: $$Props["class"] = undefined;
  export let value: $$Props["value"] = undefined;
	export { className as class };

	const { attrs } = getFormControl();
</script>

<Textarea
  {...$attrs}
  class={cn("data-[fs-error]:border-red-600", className)}
  bind:value
  {...$$restProps}
/>