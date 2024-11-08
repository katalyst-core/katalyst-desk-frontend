<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { House, Layers3, Cog, Plug, Satellite } from 'lucide-svelte';

	import * as Collapsible from '$ui/collapsible';
	import { Separator } from '$ui/separator';
	import { SidebarItem, SidebarSubItem } from './navigation';
	import { UserBox } from './user';
	import { OrganizationDropdown } from './organization';

	import { socket } from '$stores/socket-store';
	import type { SidebarObject } from '$types/sidebar-type';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let activeOrgId = $derived($page.params.org);

	const items: SidebarObject[] = $state([
		{
			label: 'Dashboard',
			icon: House,
			path: '/dashboard'
		},
		{
			label: 'Ticket',
			icon: Layers3,
			path: '/ticket'
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
	]);

	const bottomItems: SidebarObject[] = $state([
		{
			label: 'Manage Channels',
			icon: Plug,
			path: '/channel'
		},
		{
			label: 'Manage Org',
			icon: Cog,
			path: '/organization'
		}
	]);

	items.forEach((item: SidebarObject) => {
		item.open = !!item.children;

		return item;
	});

	bottomItems.forEach((item: SidebarObject) => {
		item.open = !!item.children;

		return item;
	});
</script>

<div class="flex w-full h-full bg-gray-50">
	<div
		class="flex flex-col justify-between w-64 h-screen px-2 py-2 bg-gray-50 border-r-2 border-gray-200"
	>
		<!-- Top -->
		<div class="flex flex-col w-full gap-2 flex-grow">
			<OrganizationDropdown />

			<Separator />

			<!-- Navigation -->
			{#if activeOrgId}
				<div class="flex flex-col w-full justify-between font-medium text-gray-900 flex-grow pb-2">
					<ul class="flex flex-col w-full gap-1">
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

					<ul class="flex flex-col w-full gap-1">
						{#each bottomItems as item}
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
			{/if}
		</div>

		<!-- <span>
			<Satellite class={$socket?.connected ? 'text-green-500' : 'text-red-500'} />
		</span> -->

		<!-- Bottom -->
		<div class="">
			<UserBox />
		</div>
	</div>
	{@render children()}
</div>
