<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { StoreObject } from '$lib/types';
	import { activeStore } from '$stores/store';
	import StoreItem from './StoreItem.svelte';

  export let buttonWidth;
  export let disabled = false;
  export let storeList: StoreObject[] | null = null;
  export let activeStoreData: StoreObject | null;

  const setActiveStore = (storeId: string) => {
    if (activeStoreData && activeStoreData.id === storeId) {
      return;
    }

    activeStore.set(storeId);
  };
</script>


<DropdownMenu.Root>
  <DropdownMenu.Trigger class="w-full" {disabled}>
    <slot />
  </DropdownMenu.Trigger>

  <DropdownMenu.Content style="width: {buttonWidth}px">
    <DropdownMenu.Label>My Stores</DropdownMenu.Label>
    <DropdownMenu.Separator />
    {#if storeList && activeStoreData}
      {#each storeList as store}
        <DropdownMenu.Item on:click={() => setActiveStore(store.id)}>
          <StoreItem name={store.name} active={store.id === activeStoreData.id} />
        </DropdownMenu.Item>
      {/each}
    {/if}
    <DropdownMenu.Item>
      <StoreItem name={null} />
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>