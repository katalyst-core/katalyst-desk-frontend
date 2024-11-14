<script lang="ts">
  import type { Snippet } from 'svelte';
	import { Tabs } from 'bits-ui';

	import { cn } from '$lib/utils';
	import { ScrollArea } from '$ui/scroll-area';

	interface Props {
		class?: string;
    children: () => ReturnType<Snippet>;
	}

	let { class: className, children }: Props = $props();
</script>

<Tabs.List class="h-full">
	<ScrollArea class="h-full">
		<div class={cn('flex flex-col w-52 space-y-1', className)}>
			{@render children()}
		</div>
	</ScrollArea>
</Tabs.List>
