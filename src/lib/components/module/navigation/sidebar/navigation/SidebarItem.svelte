<script lang="ts">
	import { ChevronDown } from 'lucide-svelte';
	import type { Component } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	interface Props {
		label: string;
		icon: typeof Component;
		path: string;
		hasChildren: boolean;
		open: boolean | undefined;
	}

	let { label, icon: Icon, path, hasChildren, open = $bindable(false) }: Props = $props();

	let activeOrgId = $derived($page.params.org);
	let browserPath = $derived($page.url.pathname);
	let target = $derived(`/app/${activeOrgId}${path}`);
	let isSelected = $derived(browserPath.startsWith(target || '#'));

	onMount(() => {
		open = hasChildren ? isSelected : false;
	});
</script>

<li class="sidebar-item">
	<a
		href={!hasChildren ? target : null}
		onclick={() => (open = !open)}
		class="justify-between {isSelected ? 'sidebar-item-selected' : ''}"
	>
		<div class="flex gap-4">
			<Icon class="w-6 h-6"></Icon>
			<span>{label}</span>
		</div>
		{#if hasChildren}
			<ChevronDown class="w-6 h-6 text-gray-700 {open ? 'rotate-180' : ''} transition-transform" />
		{/if}
	</a>
</li>
