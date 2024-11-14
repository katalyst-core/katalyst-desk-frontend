<script lang="ts">
	import type { Snippet } from 'svelte';
	import { LogOut } from 'lucide-svelte';

	import * as DropdownMenu from '$ui/dropdown-menu';

	interface Props {
		children: Snippet<
			[
				{
					props: Record<string, unknown>;
				}
			]
		>;
	}

	let { children }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child(props)}
			{@render children(props)}
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content side="top" class="w-[--bits-dropdown-menu-anchor-width]">
		<a href="/auth/sign-out">
			<DropdownMenu.Item>
				<LogOut class="w-6 h-6" />
				Logout
			</DropdownMenu.Item>
		</a>
	</DropdownMenu.Content>
</DropdownMenu.Root>
