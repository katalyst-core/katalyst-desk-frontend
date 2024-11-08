<script lang="ts">
	import type { Component } from 'svelte';

	import { Ellipsis } from 'lucide-svelte';
	import * as DropdownMenu from '$ui/dropdown-menu';
	import { Button } from '$ui/button';

	interface Props {
		refresh: () => void;
		content: Component;
		prop: any | null;
	}

	let { refresh, content: Content, prop }: Props = $props();
</script>

<DropdownMenu.Root>
	{#if prop}
		<DropdownMenu.Trigger asChild let:builder>
			<Button variant="icon" builders={[builder]} class="w-8 h-8 p-0">
				<Ellipsis class="w-6 h-6" />
			</Button>
		</DropdownMenu.Trigger>

		<Content {refresh} {prop}></Content>
	{/if}
</DropdownMenu.Root>
