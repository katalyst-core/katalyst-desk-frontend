<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputEvents } from './index.js';
	import { cn } from '$lib/utils.js';

	interface ExtendedInputProps extends HTMLInputAttributes {
		price?: boolean;
	}

	type $$Props = ExtendedInputProps;
	type $$Events = InputEvents;

	const formatter = new Intl.NumberFormat('id-ID', {
		useGrouping: true
	});
	const formatCurrency = (value: number) => formatter.format(value);

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'] = undefined;
	export let price: $$Props['price'] = false;
	export let min: $$Props['min'] = undefined;
	export let max: $$Props['max'] = undefined;
	export { className as class };

	// Workaround for https://github.com/sveltejs/svelte/issues/9305
	// Fixed in Svelte 5, but not backported to 4.x.
	export let readonly: $$Props['readonly'] = undefined;

	$: displayValue = price ? formatCurrency(value) : value;
	let inputElement: HTMLInputElement | null = null;

	const handleMinMax = () => {
		const minValue = typeof min === 'string' ? parseInt(min) : min;
		const maxValue = typeof max === 'string' ? parseInt(max) : max;

		if (minValue != undefined && parseInt(displayValue) < minValue) {
			displayValue = min;
			return;
		}

		if (maxValue != undefined && parseInt(displayValue) > maxValue) {
			displayValue = max;
			return;
		}
	}

	const handleNumberInput = (event: any) => {
		if (price) {
			const rawValue = event.target.value.replace(/[^\d]/g, '');
			value = rawValue ? parseInt(rawValue) : 0;

			const cursorPosition = event.target.selectionStart;
			const prevLength = event.target.value.length;
			const newLength = displayValue.length;
			const adjustment = newLength - prevLength;
			const newPosition = cursorPosition + adjustment;

			requestAnimationFrame(() => {
				if (inputElement) {
					inputElement.setSelectionRange(newPosition, newPosition);
				}
			});
		} else {
			handleMinMax();
			value = displayValue;
			console.log(displayValue);
		}
	};
</script>

<input
	class={cn(
		'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-gray-600',
		className
	)}
	bind:this={inputElement}
	bind:value={displayValue}
	{readonly}
	on:blur
	on:change
	on:click
	on:focus
	on:focusin
	on:focusout
	on:keydown
	on:keypress
	on:keyup
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:mousemove
	on:paste
	on:wheel|passive
	{...$$restProps}
	on:input={handleNumberInput}
/>
