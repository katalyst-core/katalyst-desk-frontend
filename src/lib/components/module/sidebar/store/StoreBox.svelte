<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowLeftRight } from 'lucide-svelte';

	import * as Avatar from '$ui/avatar';
	import { Skeleton } from '$ui/skeleton';
	import StoreMenu from './StoreMenu.svelte';

	import type { StoreObject } from '$types/store';
	import { stores, currentStore } from '$stores/store';
	import { getTextInitials, textToColor } from '$utils/index';

	let storeList: StoreObject[] | null = null;
	let currentStoreData: StoreObject | null = null;
	let storeName = '';
	let buttonWidth: number;

	$: initials = getTextInitials(storeName);
	$: avatarColor = textToColor(storeName);

	onMount(() => {
		stores.subscribe((stores) => (storeList = stores));
		currentStore.subscribe((storeId) => {
			if (storeId === null || storeList === null) {
				currentStoreData = null;
				return;
			}

			currentStoreData = storeList.find((s) => s.id === storeId) || null;

			if (currentStoreData == null) {
				return;
			}

			storeName = currentStoreData.name;
		});
	});
</script>

<StoreMenu {buttonWidth} {storeList} {currentStoreData} disabled={!storeList}>
	<div
		bind:clientWidth={buttonWidth}
		class="flex justify-between items-center w-full h-14 px-2 select-none cursor-pointer text-left rounded-xl bg-transparent text-gray-800 hover:bg-gray-200 transition-all"
	>
		{#if !!storeList}
			<div class="flex gap-2">
				<Avatar.Root>
					<Avatar.Image src="" alt="" />
					<Avatar.Fallback class="font-medium {avatarColor}">{initials}</Avatar.Fallback>
				</Avatar.Root>
				<div class="flex flex-col justify-center font-medium">
					<p class="w-40 truncate">{storeName}</p>
				</div>
			</div>
			<ArrowLeftRight class="w-5 h-5 mx-2" />
		{:else}
			<div class="flex w-full gap-2 items-center">
				<Skeleton class="w-10 h-10 rounded-full" />
				<Skeleton class="w-40 h-4" />
			</div>
		{/if}
	</div>
</StoreMenu>
