<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Plug, SquareUserRound, UsersRound, Cog } from 'lucide-svelte';

	import * as Sidebar from '$ui/sidebar';
	import { ScrollArea } from '$ui/scroll-area';
	import { SideMenu } from '$module/navigation/side-menu';

	import { orgTarget } from '$utils/index';
	import { CHANNEL_MANAGE, ORG_MANAGE } from '$lib/permissions';

	const nav = [
		{
			label: 'Team Management',
			items: [
				{
					title: 'Teams',
					icon: UsersRound,
					target: '/teams'
				},
				{
					title: 'Agents',
					icon: SquareUserRound,
					target: '/agents'
				}
			]
		},
		{
			label: 'Organization',
			items: [
				{
					title: 'Channels',
					icon: Plug,
					target: '/channels',
					permission: CHANNEL_MANAGE
				},
				{
					title: 'Settings',
					icon: Cog,
					target: '/settings',
					permission: ORG_MANAGE
				}
			]
		}
	];

	let { children } = $props();

	onMount(() => {
		const firstTab = orgTarget(`/manage${nav[0].items[0].target}`);

		if (!firstTab) return;

		goto(firstTab, {
			invalidateAll: true
		});
	});
</script>

<Sidebar.Provider class="items-start w-full h-full min-h-full">
	<SideMenu prefix="/manage" items={nav} />
	<main class="w-full h-full">
		<ScrollArea class="w-full h-full">
			{@render children()}
		</ScrollArea>
	</main>
</Sidebar.Provider>
