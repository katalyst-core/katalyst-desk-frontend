<script lang="ts">
  import { onMount } from "svelte";

	import Sidebar from "$lib/components/module/sidebar/Sidebar.svelte";
	import LoadingPage from "$lib/components/module/page/LoadingPage.svelte";
	import CreateStoreDialog from "$lib/components/module/modal/CreateStoreDialog.svelte";
	import { type ApiResponse } from "$types/api";
	import type { OrganizationListObject } from "$types/organization";
	import { fetchApi } from "$lib/custom-fetch";
	import { toast } from "svelte-french-toast";
	import { availableOrganizations } from "$stores/organization";

  let hasOrganization = false;
  let openCreateStoreDialog = false;

  const getAllOrganizations = async () => {
    const response: ApiResponse<OrganizationListObject[]> | null = await fetchApi('/organization/get-all');

		if (!response) {
			return;
		}

		if (!response.ok) {
			toast.error('Unable to retrieved stores');
			return;
		}

		const { data } = response;
    console.log(data);
		availableOrganizations.set(data);
  }

  const checkOrganizations = async () => {
    availableOrganizations.subscribe((org) => {
      if (!org) {
        hasOrganization = false;
        return;
      }

      if (org.length === 0) {
        hasOrganization = false;
        // Open create or invite new organization
      }

      hasOrganization = true;
    });
  }

  onMount(async () => {
    getAllOrganizations();
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

<CreateStoreDialog bind:open={openCreateStoreDialog} closeable={false} />