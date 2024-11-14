<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { Sidebar, SidebarProvider, SidebarTrigger } from '$module/navigation/sidebar';
	import { CreateOrganizationDialog } from '$module/modal';

	import * as OrganizationAPI from '$api/organization-api';
	import { connectSocket, disconnectSocket } from '$lib/socket-handler';
	import { availableOrganizations } from '$stores/organization-store';
	import { House, Inbox, Calendar, Search, Settings } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import type { ClassValue } from 'tailwind-variants';

	let { children } = $props();

	let openCreateOrganizationDialog = $state(false);

	const setOrganizationList = async () => {
		const response = await OrganizationAPI.fetchOrganizationList();

		if (!response) {
			return;
		}

		const { data: organizations } = response;
		availableOrganizations.set(organizations);

		openCreateOrganizationDialog = organizations.length <= 0;
	};

	onMount(async () => {
		await setOrganizationList();
		await connectSocket();
		console.log('socket connected');
	});

	onDestroy(() => {
		disconnectSocket();
	});
</script>

<SidebarProvider class="w-full h-full bg-background text-foreground  dark">
	<Sidebar />
	<div class="flex flex-col w-full h-full">
		<div class="w-full h-12 flex items-center px-2 border-b border-border">
			<SidebarTrigger />
		</div>
		<main class="w-full h-full overflow-auto">
			{@render children()}
		</main>
	</div>
</SidebarProvider>

<CreateOrganizationDialog bind:open={openCreateOrganizationDialog} closeable={false} />
