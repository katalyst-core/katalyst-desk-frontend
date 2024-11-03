<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { Tabs } from 'bits-ui';

	interface Props {
		icon?: () => ReturnType<Snippet>
		title: string;
		class?: string;
		value: string;
	}

	let { icon, title, value, class: className }: Props = $props();
</script>

<Tabs.Trigger
	{value}
	class={cn(
		'flex items-center w-full h-10 px-2 rounded-md hover:bg-gray-200 data-[state=active]:bg-gray-200 transition-colors text-nowrap overflow-hidden',
		className
	)}
>
	<div class="flex items-center space-x-2 font-medium">
		{#if icon}
			{@render icon()}
		{/if}
		<span class="text-ellipsis overflow-hidden">{title}</span>
	</div>
</Tabs.Trigger>
