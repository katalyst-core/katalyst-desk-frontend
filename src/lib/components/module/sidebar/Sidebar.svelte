<script lang="ts">
	import { House, Layers3, Cog } from 'lucide-svelte';

	import * as Collapsible from '$ui/collapsible';
	import { Separator } from '$ui/separator';
	import SidebarItem from './navigation/SidebarItem.svelte';
	import SidebarSubItem from './navigation/SidebarSubItem.svelte';
	import UserBox from './user/UserBox.svelte';
	import OrganizationDropdown from './organization/OrganizationDropdown.svelte';

	import type { SidebarObject } from '$types/sidebar-type';

	const items = [
		{
			label: 'Dashboard',
			icon: House,
			path: '/app/dashboard'
		},
		{
			label: 'Ticket',
			icon: Layers3,
			path: '/app/ticket',
		},
		{
			label: 'Manage Org',
			icon: Cog,
			path: '/app/organization'
		}
		// {
		// 	label: 'Product',
		// 	icon: Library,
		// 	path: '/app/product',
		// 	children: [
		// 		{
		// 			label: 'Manage Product',
		// 			path: '/app/product/manage'
		// 		},
		// 		{
		// 			label: 'Manage Stock',
		// 			path: '/app/product/stock'
		// 		}
		// 	]
		// },
		// {
		// 	label: 'Order',
		// 	icon: Clock,
		// 	path: '/app/order'
		// }
	] as SidebarObject[];

	items.forEach((item: SidebarObject) => {
		if (item.children) {
			item.open = false;
		}

		return item;
	});
</script>

<div class="flex w-full h-full bg-gray-50">
	<div
		class="flex flex-col justify-between w-64 h-screen px-2 py-2 bg-gray-50 border-r-2 border-gray-200"
	>
		<!-- Top -->
		<div class="flex flex-col w-full gap-2">
			<OrganizationDropdown />

			<Separator />

			<ul class="flex flex-col w-full gap-1 font-medium text-gray-900">
				{#each items as item}
					<SidebarItem
						label={item.label}
						icon={item.icon}
						path={item.path}
						hasChildren={!!item.children}
						bind:open={item.open}
					/>
					{#if !!item.children}
						<Collapsible.Root bind:open={item.open}>
							<Collapsible.Content class="flex flex-col">
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
