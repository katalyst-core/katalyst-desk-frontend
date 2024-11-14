<!-- Modified -->

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { cn } from '$lib/utils.js';

	interface Props {
		suffix?: string;
	}

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		type = 'text',
		suffix = '',
		...restProps
	}: WithElementRef<HTMLInputAttributes> & Props = $props();

	let isHidden = $state(true);
</script>

<div class="relative flex items-center w-full">
	{#if type === 'password-toggle'}
		<input
			bind:this={ref}
			class={cn(
				'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			type={isHidden ? 'password' : 'text'}
			bind:value
			{...restProps}
		/>
		<div class="absolute right-0 flex items-center mr-2">
			<button type="button" onclick={() => (isHidden = !isHidden)}>
				{#if isHidden}
					<Eye />
				{:else}
					<EyeOff />
				{/if}
			</button>
		</div>
	{:else}
		<!-- {#if type === 'price'}
			<span class="absolute left-0 ml-3 text-base">Rp</span>
		{/if} -->

		<input
			bind:this={ref}
			class={cn(
				'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			bind:value
			{...restProps}
		/>

		{#if suffix}
			<span
				class="absolute right-0 text-sm text-gray-400 select-none {type === 'number'
					? 'mr-10'
					: 'mr-3'}">{suffix}</span
			>
		{/if}
	{/if}
</div>
