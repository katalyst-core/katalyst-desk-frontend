<script lang="ts">
  import { onDestroy, onMount } from "svelte";

	import Sidebar from "$lib/components/module/sidebar/Sidebar.svelte";
	import LoadingPage from "$lib/components/module/page/LoadingPage.svelte";

	import { availableOrganizations } from "$stores/organization-store";
  import { CreateOrganizationDialog } from "$module/modal";
	import * as OrganizationAPI from "$api/organization-api";
  import { connectSocket, disconnectSocket } from '$lib/socket-handler';

  let hasOrganization = false;
  let openCreateOrganizationDialog = false;

  const checkOrganizations = () => {
    availableOrganizations.subscribe((org) => {
      if (!org) {
        hasOrganization = false;
        return;
      }

      if (org.length === 0) {
        hasOrganization = false;
        openCreateOrganizationDialog = true;
      }

      hasOrganization = true;
    });
  }

  onMount(async () => {
    OrganizationAPI.fetchOrganizationList();
    checkOrganizations();

    connectSocket();
  });

  onDestroy(() => {
    disconnectSocket();
  })
</script>

<Sidebar>
  <LoadingPage loading={!hasOrganization}>
    <div class="w-full h-full bg-muted overflow-auto">
      <slot />
    </div>
  </LoadingPage>
</Sidebar>

<CreateOrganizationDialog bind:open={openCreateOrganizationDialog} closeable={false} />