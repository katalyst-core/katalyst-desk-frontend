<script lang="ts">
	import type { ClassValue } from 'tailwind-variants';
	import { page } from '$app/stores';

	import * as Sidebar from '$ui/sidebar';
	import { cn } from '$lib/utils';
	import { agentHasPermission } from '$utils/index';

	interface SidebarItem {
		title: string;
		icon: any;
		target: string;
		permission?: bigint;
	}

	interface Props {
		label?: string;
		items: SidebarItem[];
		class?: string;
	}

	let { label, items, class: className }: Props = $props();

	let activeOrgId = $derived($page.params.org);
	let pathName = $derived($page.url.pathname);
	let orgTarget = $derived(`/app/${activeOrgId}`);
	let newItems = $derived(
		items.filter((item) => (item.permission ? agentHasPermission(item.permission) : true))
	);
</script>

<Sidebar.Group class={className}>
	{#if label && newItems.length > 0}
		<Sidebar.GroupLabel>{label}</Sidebar.GroupLabel>
	{/if}
	<Sidebar.GroupContent>
		<Sidebar.Menu>
			{#each newItems as item (item.title)}
				{@const target = `${orgTarget}${item.target}`}
				{@const isSelected = pathName.startsWith(target)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton isActive={isSelected}>
						{#snippet child({ props })}
							{@const classValue = props.class as ClassValue}
							<a href={target} {...props} class={cn(classValue, 'h-10 space-x-1 transition-all')}>
								<item.icon class="!w-5 !h-5" />
								<span class="text-base">{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
