<script lang="ts">
	import { House, Library, Clock } from "lucide-svelte";

	import Sidebar from "$lib/components/module/sidebar/Sidebar.svelte";
	import type { SItems } from "$lib/components/module/sidebar/navigation/types";

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
</script>

<Sidebar items={sidebarItems}>
  <slot />
</Sidebar>