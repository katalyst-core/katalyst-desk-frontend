<script lang="ts">
	import { scrollToBottom } from '$utils/index';
	import { LoaderCircle } from 'lucide-svelte';
	import { onDestroy, onMount, tick } from 'svelte';

	interface Props {
		element: HTMLDivElement;
		fetch: Function;
		direction?: 'up' | 'down';
		threshold?: number;
		refetchThreshold?: number;
	}

	let {
		element = $bindable(),
		fetch,
		direction = 'up',
		threshold = 1,
		refetchThreshold = 50
	}: Props = $props();

	let hasFetched = $state(false);
	let isLoading = $state(false);

	const fetchOnTop = async () => {
		const scrollTop = element.scrollTop;

		if (hasFetched && scrollTop > refetchThreshold) {
			hasFetched = false;
		}

		if (scrollTop > threshold || isLoading || hasFetched) return;

		const scrollHeightBefore = element.scrollHeight;

		isLoading = true;

		await fetch();

		hasFetched = true;
		isLoading = false;

		await tick();

		if (!element) return;

		const scrollHeightAfter = element.scrollHeight;
		const heightDifference = scrollHeightAfter - scrollHeightBefore;

		element.scrollTop += heightDifference;
	};

	const fetchOnBottom = async () => {
		const { scrollTop, scrollHeight, clientHeight } = element;

		if (hasFetched && scrollTop + clientHeight < scrollHeight - refetchThreshold) {
			hasFetched = false;
		}

		if (scrollTop + clientHeight <= scrollHeight - threshold || isLoading || hasFetched) return;

		isLoading = true;

		await tick();
		scrollToBottom(element);
		await fetch();

		hasFetched = true;
		isLoading = false;
	};

	const onScroll = async () => {
		if (direction == 'up') {
			await fetchOnTop();
		} else {
			await fetchOnBottom();
		}
	};

	onMount(() => {
		if (!element) {
			return;
		}

		element.addEventListener('scroll', onScroll);
	});

	onDestroy(() => {
		if (!element) {
			return;
		}

		element.removeEventListener('scroll', onScroll);
	});
</script>

{#if isLoading}
	<div class="flex w-full justify-center items-center py-4">
		<LoaderCircle class="animate-spin w-8 h-8" />
	</div>
{/if}
