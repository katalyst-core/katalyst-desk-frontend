<script lang="ts">
	import { page } from '$app/stores';
	import { House, Inbox, Calendar, Search, Settings, Cog, Plug } from 'lucide-svelte';

	import * as Sidebar from '$ui/sidebar';
	import { SidebarItem } from '.';
	import { Separator } from '$ui/separator';
	import { OrganizationDropdown } from './organization';
	import { UserBox } from './user';

	let activeOrgId = $derived($page.params.org);

	const mainNav = [
		{
			title: 'Dashboard',
			target: '/dashboard',
			icon: House
		},
		{
			title: 'Ticket',
			target: '/ticket',
			icon: Inbox
		}
	];

	const bottomNav = [
		{
			title: 'Manage Team',
			icon: Plug,
			target: '/team'
		},
		{
			title: 'Manage Channels',
			icon: Plug,
			target: '/channel'
		},
		{
			title: 'Manage',
			icon: Cog,
			target: '/manage'
		}
	];
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<OrganizationDropdown />
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>

	<Separator />

	<Sidebar.Content>
		{#if activeOrgId}
			<SidebarItem items={mainNav} />
			<SidebarItem items={bottomNav} class="mt-auto" />
		{/if}
	</Sidebar.Content>

	<Separator />

	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<UserBox />
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
