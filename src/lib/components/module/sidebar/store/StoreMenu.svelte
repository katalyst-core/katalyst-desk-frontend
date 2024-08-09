<script lang="ts">
  import * as DropdownMenu from '$ui/dropdown-menu';
  import { CreateStoreDialog } from '$module/modal';
	import StoreItem from './StoreItem.svelte';

	import type { StoreObject } from '$types/store';
	import { currentStore } from '$stores/store';

  export let buttonWidth;
  export let disabled = false;
  export let storeList: StoreObject[] | null = null;
  export let currentStoreData: StoreObject | null;

  let openCreateStoreDialog: boolean = false;

  const toggleCreateStoreDialog = () => openCreateStoreDialog = !openCreateStoreDialog;

  const setCurrentStore = (storeId: string) => {
    if (currentStoreData && currentStoreData.id === storeId) {
      return;
    }

    currentStore.set(storeId);
  };
</script>


<DropdownMenu.Root>
  <DropdownMenu.Trigger class="w-full" {disabled}>
    <slot />
  </DropdownMenu.Trigger>

  <DropdownMenu.Content style="width: {buttonWidth}px">
    <DropdownMenu.Label>My Stores</DropdownMenu.Label>
    <DropdownMenu.Separator />
    {#if storeList && currentStoreData}
      {#each storeList as store}
        <DropdownMenu.Item on:click={() => setCurrentStore(store.id)}>
          <StoreItem name={store.name} active={store.id === currentStoreData.id} />
        </DropdownMenu.Item>
      {/each}
    {/if}
    <DropdownMenu.Item on:click={toggleCreateStoreDialog}>
      <StoreItem name={null} />
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<CreateStoreDialog bind:open={openCreateStoreDialog} />