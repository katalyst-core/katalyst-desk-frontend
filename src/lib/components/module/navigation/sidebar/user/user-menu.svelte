<script lang="ts">
	import type { Snippet } from 'svelte';
	import { LogOut, Cog } from 'lucide-svelte';

	import * as DropdownMenu from '$ui/dropdown-menu';
	import UserSettings from './user-settings.svelte';

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

	let settingsOpen = $state(false);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child(props)}
			{@render children(props)}
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content side="top" class="w-[--bits-dropdown-menu-anchor-width]">
		<DropdownMenu.Item onclick={() => settingsOpen = true}>
			<Cog class="w-6 h-6" />
			Settings
		</DropdownMenu.Item>

		<a href="/auth/sign-out">
			<DropdownMenu.Item>
				<LogOut class="w-6 h-6" />
				Logout
			</DropdownMenu.Item>
		</a>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<UserSettings bind:open={settingsOpen} />