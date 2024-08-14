<script lang="ts">
	import * as FormPrimitive from "formsnap";
	import { cn } from "$lib/utils.js";

	interface ExtendedLegendProps extends FormPrimitive.LegendProps {
		required?: boolean;
	}

	type $$Props = ExtendedLegendProps;

	let className: $$Props["class"] = undefined;
	export let required: $$Props["required"] = false;
	export { className as class };
</script>

<FormPrimitive.Legend
	{...$$restProps}
	class={cn("text-sm font-medium leading-none data-[fs-error]:text-destructive", className)}
	let:legendAttrs
>
	<slot {legendAttrs} />
	{#if required}
		<span class="text-red-500">*</span>
	{/if}
</FormPrimitive.Legend>
