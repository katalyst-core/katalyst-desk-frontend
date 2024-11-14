<script lang="ts">
	import { page } from '$app/stores';
	import { SideMenu } from '$module/navigation/side-menu';

	// import * as Breadcrumb from "$ui/breadcrumb/index.js";
	import { Button } from '$ui/button/index.js';
	import * as Dialog from '$ui/dialog/index.js';
	import ScrollArea from '$ui/scroll-area/scroll-area.svelte';
	import * as Sidebar from '$ui/sidebar/index.js';
	import { orgTarget } from '$utils/index';
	import Bell from 'lucide-svelte/icons/bell';
	import Check from 'lucide-svelte/icons/check';
	import Globe from 'lucide-svelte/icons/globe';
	import House from 'lucide-svelte/icons/house';
	import Keyboard from 'lucide-svelte/icons/keyboard';
	import Link from 'lucide-svelte/icons/link';
	import Lock from 'lucide-svelte/icons/lock';
	import Menu from 'lucide-svelte/icons/menu';
	import MessageCircle from 'lucide-svelte/icons/message-circle';
	import Paintbrush from 'lucide-svelte/icons/paintbrush';
	import Settings from 'lucide-svelte/icons/settings';
	import Video from 'lucide-svelte/icons/video';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	const data = [
		{ name: 'Teams', target: '/manage/teams', icon: Bell },
		{ name: 'Agents', target: '/manage/agents', icon: Menu }
	];

	let open = $state(false);
	console.log($page);
</script>

<div class="flex w-full h-full">
	<div class="h-full w-64 px-2 py-4">
		<SideMenu />
	</div>
	<main class="flex flex-1 flex-col h-full">
		<ScrollArea>
			{@render children()}
		</ScrollArea>
	</main>
</div>
