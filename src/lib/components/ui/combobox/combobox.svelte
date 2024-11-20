<script lang="ts">
	import type { Snippet } from 'svelte';

	import * as Popover from '$ui/popover';
	import * as Command from '$ui/command';

	import type { ComboboxItem } from '.';
	import { LoaderCircle } from 'lucide-svelte';

	interface Props {
		items: ComboboxItem[] | null;
		children: Snippet;
		open?: boolean;
		onSelect?: (value: string) => any;
		disabled?: boolean;
		placeholder?: string;
	}

	let {
		items,
		children,
		open = $bindable(false),
		onSelect,
		disabled = false,
		placeholder = 'Search...'
	}: Props = $props();

	const onClick = (value: string) => {
		open = false;
		onSelect?.(value);
	};
</script>

<Popover.Root bind:open>
	<Popover.Trigger {disabled}>
		{@render children()}
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Input {placeholder} />
			<Command.List>
				<Command.Group>
					{#if items !== null && items.length > 0}
						{#each items as item}
							<Command.Item
								class="cursor-pointer"
								value={item.value}
								onSelect={() => onClick(item.value)}
							>
								{item.label}
							</Command.Item>
						{/each}
					{:else}
						<div class="w-full py-2 flex justify-center items-center space-x-2">
							{#if items === null}
								<LoaderCircle class="w-4 h-4 animate-spin" />
								<span>Loading</span>
							{:else if items.length === 0}
								<span>No items</span>
							{/if}
						</div>
					{/if}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
