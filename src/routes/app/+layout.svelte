<script lang="ts">
	import { House, Library, Clock } from "lucide-svelte";

	import { onMount } from "svelte";

	import Sidebar from "$lib/components/module/sidebar/Sidebar.svelte";
	import type { SItems } from "$lib/components/module/sidebar/navigation/types";
	import { stores } from "$stores/store";
	import { fetchStores } from "$lib/services/store";
	import LoadingPage from "$lib/components/module/page/LoadingPage.svelte";
	import CreateStoreDialog from "$lib/components/module/modal/CreateStoreDialog.svelte";

  const sidebarItems = [
    {
      label: 'Dashboard',
      icon: House,
      path: '/app/dashboard'
    },
    {
      label: 'Product',
      icon: Library,
      path: '/app/product',
      children: [
        {
          label: 'Manage products',
          path: '/app/product/manage'
        },
        {
          label: 'Manage Stock',
          path: '/app/product/stock'
        }
      ]
    },
    {
      label: 'Order',
      icon: Clock,
      path: '/app/order',
    }
  ] satisfies SItems;

  let hasStores = true;
  let openCreateStoreDialog = false;

  onMount(async () => {
    stores.subscribe((stores) => {
      if (!stores) {
        hasStores = false;
        return;
      }

      if (stores.length === 0) {
        hasStores = false;
        openCreateStoreDialog = true;
        return;
      }

      hasStores = true;
    });

    fetchStores();
  });
</script>

<Sidebar items={sidebarItems}>
  <div class="w-full h-full">
    <LoadingPage loading={!hasStores}>
      <slot />
    </LoadingPage>
  </div>
</Sidebar>

<CreateStoreDialog bind:open={openCreateStoreDialog} closeable={false} />