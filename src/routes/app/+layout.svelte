<script lang="ts">
	import { onDestroy, onMount, type Snippet } from 'svelte';

	import Sidebar from '$module/navigation/sidebar/Sidebar.svelte';
	import LoadingPage from '$lib/components/module/page/LoadingPage.svelte';
	import { CreateOrganizationDialog } from '$module/modal';

	import * as OrganizationAPI from '$api/organization-api';
	import { connectSocket, disconnectSocket } from '$lib/socket-handler';
	import { availableOrganizations } from '$stores/organization-store';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

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
	})
</script>

<Sidebar>
		<div class="w-full h-full bg-muted overflow-auto">
			{@render children()}
		</div>
</Sidebar>

<CreateOrganizationDialog bind:open={openCreateOrganizationDialog} closeable={false} />
