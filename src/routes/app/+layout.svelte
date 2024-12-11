<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Signal, Sun, Moon } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';

	import { Sidebar, SidebarProvider, SidebarTrigger } from '$module/navigation/sidebar';
	import { Button } from '$ui/button';

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
			<div class="flex space-x-2 items-center">
				<Signal class={$isSockedConnected ? 'text-green-500' : 'text-red-500'} />
				<Button onclick={toggleMode} variant="ghost" size="icon">
					<Sun
						class="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
				</Button>
			</div>
		</div>
		<main class="w-full h-full overflow-auto">
			{@render children()}
		</main>
	</div>
</SidebarProvider>
