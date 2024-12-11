<script lang="ts" module>
	export interface SidebarItem {
		title: string;
		icon: any;
		target: string;
		permission?: bigint;
	}

	interface SidebarGroupItems {
		label?: string;
		items: SidebarItem[];
	}
</script>

<script lang="ts">
	import * as Sidebar from '$ui/sidebar';
	import SideMenuItem from './side-menu-item.svelte';

	interface Props {
    prefix?: string;
		items: SidebarGroupItems[];
	}

	let { items, prefix }: Props = $props();
</script>

<Sidebar.Root collapsible="none" class="hidden md:flex">
	<Sidebar.Content>
		{#each items as item (item.label)}
      <SideMenuItem {prefix} label={item.label} items={item.items} />
    {/each}
	</Sidebar.Content>
</Sidebar.Root>
