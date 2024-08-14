<script lang="ts">
	import { getFormControl } from "formsnap";
	import { Input, type ExtendedInputProps } from "$lib/components/ui/input";
	import { cn } from "$lib/utils.js";

	type $$Props = ExtendedInputProps;

	let className: $$Props["class"] = undefined;
	export let type: $$Props["type"] = undefined;
  export let value: $$Props["value"] = undefined;
	export let label: string = '';
	export { className as class };

	const { attrs } = getFormControl();
</script>

<Input
  {...$attrs}
  class={cn("data-[fs-error]:border-red-600", className)}
  bind:value
	{type}
	{label}
  {...$$restProps}
/>