<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
	import { getFormControl } from "formsnap";
	import { PasswordInput } from "$lib/components/ui/password-input";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLInputAttributes;

	let className: $$Props["class"] = undefined;
  export let value: $$Props["value"] = undefined;
	export { className as class };

	const { attrs } = getFormControl();
</script>

<PasswordInput
  {...$attrs}
  class={cn("data-[fs-error]:border-red-600", className)}
  bind:value
  {...$$restProps}
/>