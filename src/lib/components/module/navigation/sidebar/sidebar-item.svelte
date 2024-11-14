<script lang="ts">
	import type { ClassValue } from 'tailwind-variants';
	import { page } from '$app/stores';

	import * as Sidebar from '$ui/sidebar';
	import { cn } from '$lib/utils';

	interface SidebarItem {
		title: string;
		icon: any;
		target: string;
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
</script>

<Sidebar.Group class={className}>
  {#if label}
	  <Sidebar.GroupLabel>{label}</Sidebar.GroupLabel>
  {/if}
	<Sidebar.GroupContent>
		<Sidebar.Menu>
			{#each items as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						{#snippet child({ props })}
              {@const classValue = props.class as ClassValue}
              {@const target = `${orgTarget}${item.target}`}
              {@const isSelected = pathName.startsWith(target)}
							<a
								href={target}
								{...props}
								class={cn(classValue, `h-10 space-x-1 transition-all ${isSelected && 'bg-sidebar-accent'}`)}
							>
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
