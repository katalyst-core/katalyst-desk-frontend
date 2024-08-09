<script lang="ts">
	import type { ComponentType } from 'svelte';

	import { Ellipsis } from 'lucide-svelte';
	import * as DropdownMenu from '$ui/dropdown-menu';
	import { Button } from '$ui/button';

	export let refresh: () => void;
	export let content: ComponentType;
	export let prop: any | null;
</script>

<DropdownMenu.Root>
	{#if prop}
		<DropdownMenu.Trigger asChild let:builder>
			<Button variant="icon" builders={[builder]} class="w-8 h-8 p-0">
				<Ellipsis class="w-6 h-6" />
			</Button>
		</DropdownMenu.Trigger>

		<svelte:component this={content} {refresh} {prop} />
	{/if}
</DropdownMenu.Root>
