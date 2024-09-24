<script lang="ts">
  import * as DropdownMenu from '$ui/dropdown-menu';
  import { CreateStoreDialog } from '$module/modal';
	import StoreItem from './OrganizationItem.svelte';

	import type { OrganizationListObject } from '$types/organization';
	import { selectedOrganization } from '$stores/organization';

  export let buttonWidth;
  export let disabled = false;
  export let organizationList: OrganizationListObject[] | null = null;
  export let selectedOrganizationData: OrganizationListObject | null;

  let openCreateStoreDialog: boolean = false;

  const toggleCreateStoreDialog = () => openCreateStoreDialog = !openCreateStoreDialog;

  const setCurrentOrganization = (orgId: string) => {
    if (selectedOrganizationData?.organization_id === orgId) {
      return;
    }

    selectedOrganization.set(orgId);
  }
</script>


<DropdownMenu.Root>
  <DropdownMenu.Trigger class="w-full" {disabled}>
    <slot />
  </DropdownMenu.Trigger>

  <DropdownMenu.Content style="width: {buttonWidth}px">
    <DropdownMenu.Label>My Organizations</DropdownMenu.Label>
    <DropdownMenu.Separator />
    {#if organizationList}
      {#each organizationList as org}
        <DropdownMenu.Item on:click={() => setCurrentOrganization(org.organization_id)}>
          <StoreItem
            name={org.name}
            />
            <!-- active={store.id === currentStoreData.id} -->
        </DropdownMenu.Item>
      {/each}
    {/if}
    <DropdownMenu.Item on:click={toggleCreateStoreDialog}>
      <StoreItem name={null} />
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<CreateStoreDialog bind:open={openCreateStoreDialog} />