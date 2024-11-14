<script lang="ts">
	import { page } from '$app/stores';
	import type { ClassValue } from 'tailwind-variants';

	import * as Sidebar from '$ui/sidebar';
	import type { SidebarItem } from './side-menu.svelte';
	import { cn } from '$lib/utils';

	interface Props {
		label?: string;
    prefix?: string;
		items: SidebarItem[];
	}

	let { label, prefix, items }: Props = $props();

	let activeOrgId = $derived($page.params.org);
	let pathName = $derived($page.url.pathname);
	let orgTarget = $derived(`/app/${activeOrgId}`);
</script>

<Sidebar.Group>
  {#if label}
		<Sidebar.GroupLabel>{label}</Sidebar.GroupLabel>
	{/if}
	<Sidebar.GroupContent>
		<Sidebar.Menu>
			{#each items as item (item.title)}
        {@const target = `${orgTarget}${prefix || ''}${item.target}`}
				{@const isSelected = pathName.startsWith(target)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton isActive={isSelected}>
						{#snippet child({ props })}
						 {@const classValue = props.class as ClassValue}
							<a href={target} {...props} class={cn(classValue, 'h-9 transition-all')}>
								<item.icon />
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
