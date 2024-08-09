<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { InputEvents } from "$lib/components/ui/input/index.js";
	import { getFormControl } from "formsnap";
	import { Input } from "$lib/components/ui/input";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLInputAttributes;
  type $$Events = InputEvents;

	let className: $$Props["class"] = undefined;
  export let value: $$Props["value"] = undefined;
	export { className as class };

	const { attrs } = getFormControl();
</script>

<Input
  {...$attrs}
  class={cn("data-[fs-error]:border-red-600", className)}
  bind:value
  {...$$restProps}
/>