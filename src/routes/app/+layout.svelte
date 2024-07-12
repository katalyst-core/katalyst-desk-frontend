<script lang="ts">
	import { House, Library, Clock } from "lucide-svelte";

	import Sidebar from "$lib/components/module/sidebar/Sidebar.svelte";
	import type { SItems } from "$lib/components/module/sidebar/navigation/types";
	import { onMount } from "svelte";
	import { fetchApi } from "$lib/custom-fetch";
	import toast from "svelte-french-toast";
	import { activeStore, stores } from "$stores/store";
	import type { StoreObject } from "$lib/types";

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

  const getStores = async () => {
    const response = await fetchApi('/store/list');

    if (!response.ok) {
      toast.error('Unable to retrieve stores');
      return;
    }

    const result = await response.json();
    const data = result.data as StoreObject[];

    stores.set(data);

    activeStore.update((store) => {
      if (data.length === 0) {
        return null;
      }

      if (store == null) {
        return data[0].id;
      }

      if (!data.find((d: StoreObject) => d.id == store)) {
        return data[0].id;
      }

      return store;
    })
  };

  onMount(async () => {
    getStores();
  });
</script>

<Sidebar items={sidebarItems}>
  <slot />
</Sidebar>