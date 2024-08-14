<script lang="ts">
	import type { Label as LabelPrimitive } from "bits-ui";
	import { getFormControl } from "formsnap";
	import { Label } from "$lib/components/ui/label/index.js";
	import { cn } from "$lib/utils.js";

	interface ExtendedLabelProps extends LabelPrimitive.Props {
		required?: boolean;
	}

	type $$Props = ExtendedLabelProps;

	let className: $$Props["class"] = undefined;
	export let required: $$Props["required"] = false;
	export { className as class };

	const { labelAttrs } = getFormControl();
</script>

<Label {...$labelAttrs} class={cn("data-[fs-error]:text-destructive font-semibold", className)} {...$$restProps}>
	<slot {labelAttrs} />
	{#if required}
		<span class="text-red-500">*</span>
	{/if}
</Label>
