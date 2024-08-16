<script lang="ts">
	import { Eye, EyeOff } from 'lucide-svelte';
	import { BaseInput, type ExtendedInputProps } from './index.js';
	import { cn } from '$lib/utils.js';

	type $$Props = ExtendedInputProps;

	let className: $$Props['class'] = undefined;
	export let type: $$Props['type'] = 'text';
	export let value: $$Props['value'] = undefined;
	export let suffix: $$Props['suffix'] = '';
	export { className as class };

	let isHidden = true;
</script>

<div class="relative flex items-center w-full">
	{#if type === 'password-toggle'}
		<BaseInput
			class={cn('pr-9', className)}
			type={isHidden ? 'password' : 'text'}
			bind:value
			{...$$restProps}
		/>
		<div class="absolute right-0 flex items-center mr-2">
			<button type="button" on:click|preventDefault={() => (isHidden = !isHidden)}>
				{#if isHidden}
					<Eye />
				{:else}
					<EyeOff />
				{/if}
			</button>
		</div>
	{:else}
		{#if type === 'price'}
			<span class="absolute left-0 ml-3 text-base">Rp</span>
		{/if}

		<BaseInput
			class={cn(
				`${type === 'price' ? 'pl-9' : ''}`,
				className
			)}
			price={type === 'price'}
			bind:value
			{type}
			{...$$restProps}
		/>

		{#if suffix}
			<span class="absolute right-0 text-sm text-gray-400 select-none { type === 'number' ? 'mr-10' : 'mr-3' }">{suffix}</span>
		{/if}
	{/if}
</div>
