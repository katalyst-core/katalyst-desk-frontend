<script lang="ts">
	import { onDestroy, onMount, type Snippet } from 'svelte';

	import Sidebar from '$module/navigation/sidebar/Sidebar.svelte';
	import LoadingPage from '$lib/components/module/page/LoadingPage.svelte';

	import { availableOrganizations } from '$stores/organization-store';
	import { CreateOrganizationDialog } from '$module/modal';
	import * as OrganizationAPI from '$api/organization-api';
	import { connectSocket, disconnectSocket } from '$lib/socket-handler';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let hasOrganization = $state(true);
	let openCreateOrganizationDialog = $state(false);

	// const checkOrganizations = () => {
	//   availableOrganizations.subscribe((org) => {
	//     if (!org) {
	//       hasOrganization = false;
	//       return;
	//     }

	//     if (org.length === 0) {
	//       hasOrganization = false;
	//       openCreateOrganizationDialog = true;
	//     }

	//     hasOrganization = true;
	//   });
	// }

	onMount(async () => {
	  OrganizationAPI.fetchOrganizationList();
	  // checkOrganizations();

	  connectSocket();
	});

	onDestroy(() => {
	  disconnectSocket();
	})
</script>

<Sidebar>
	<LoadingPage loading={!hasOrganization}>
		<div class="w-full h-full bg-muted overflow-auto">
			{@render children()}
		</div>
	</LoadingPage>
</Sidebar>

<CreateOrganizationDialog bind:open={openCreateOrganizationDialog} closeable={false} />
