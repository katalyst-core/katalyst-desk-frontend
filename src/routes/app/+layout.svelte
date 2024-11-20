<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Satellite } from 'lucide-svelte';

	import { Sidebar, SidebarProvider, SidebarTrigger } from '$module/navigation/sidebar';

	import { OrganizationAPI } from '$api/.';
	import { connectSocket, disconnectSocket } from '$lib/socket-handler';
	import { availableOrganizations } from '$stores/organization-store';
	import { isSockedConnected } from '$stores/socket-store';

	let { children } = $props();

	const setOrganizationList = async () => {
		const response = await OrganizationAPI.getOrganizations();

		if (!response.ok) return;

		const { data: organizations } = response;
		availableOrganizations.set(organizations);
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

<SidebarProvider class="w-full h-full bg-background text-foreground">
	<Sidebar />
	<div class="flex flex-col w-full h-full">
		<div class="w-full h-12 flex justify-between items-center px-2 border-b border-border">
			<SidebarTrigger />
			<Satellite class={$isSockedConnected ? 'text-green-500' : 'text-red-500'} />
		</div>
		<main class="w-full h-full overflow-auto">
			{@render children()}
		</main>
	</div>
</SidebarProvider>
