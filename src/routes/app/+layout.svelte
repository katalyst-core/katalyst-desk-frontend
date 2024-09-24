<script lang="ts">
  import { onMount } from "svelte";

	import Sidebar from "$lib/components/module/sidebar/Sidebar.svelte";
	import LoadingPage from "$lib/components/module/page/LoadingPage.svelte";

	import { availableOrganizations } from "$stores/organization-store";
  import { CreateOrganizationDialog } from "$module/modal";
	import { fetchAllOrganization } from "$lib/api/organization-api";

  let hasOrganization = false;
  let openCreateOrganizationDialog = false;

  const checkOrganizations = async () => {
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
    fetchAllOrganization();
    checkOrganizations();
  });
</script>

<Sidebar>
  <LoadingPage loading={!hasOrganization}>
    <div class="w-full h-full p-4 bg-muted overflow-auto">
      <slot />
    </div>
  </LoadingPage>
</Sidebar>

<CreateOrganizationDialog bind:open={openCreateOrganizationDialog} closeable={false} />