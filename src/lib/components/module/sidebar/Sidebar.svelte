<script lang="ts">
	import { Clock, House, Library } from 'lucide-svelte';

  import * as Collapsible from '$lib/components/ui/collapsible';
  import { Separator } from '$lib/components/ui/separator';
	import type { SidebarObject } from '$types/sidebar';
	import SidebarItem from './navigation/SidebarItem.svelte';
	import SidebarSubItem from './navigation/SidebarSubItem.svelte';
	import UserBox from './user/UserBox.svelte';
	import StoreBox from './store/StoreBox.svelte';

  const items = [
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
          label: 'Manage Product',
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
  ] as SidebarObject[];

  items.forEach((item: SidebarObject) => {
    if (item.children) {
      item.open = false;
    }

    return item;
  });
</script>

<div class="flex w-full h-full bg-gray-100">
  <div class="flex flex-col justify-between w-72 h-screen px-2 py-4 bg-gray-50 border-r-2 border-gray-200">

    <!-- Top -->
    <div class="flex flex-col w-full gap-2">
      <StoreBox />

      <Separator />

      <ul class="flex flex-col w-full gap-1 font-medium">
        {#each items as item}
          <SidebarItem label={item.label} icon={item.icon} path={item.path} hasChildren={!!item.children} bind:open={item.open} />
          {#if !!item.children}
          <Collapsible.Root bind:open={item.open}>
            <Collapsible.Content class="flex flex-col gap-1">
              {#each item.children as child}
                <SidebarSubItem label={child.label} path={child.path} />
              {/each}
            </Collapsible.Content>
          </Collapsible.Root>
          {/if}
        {/each}
      </ul>
    </div>

    <!-- Bottom -->
    <div class="">
      <UserBox />
    </div>
  </div>
  <slot />
</div>