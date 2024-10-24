<script lang="ts">
	import { scrollToBottom } from '$utils/index';
	import { LoaderCircle } from 'lucide-svelte';
	import { onDestroy, onMount, tick } from 'svelte';

	export let element: HTMLElement;
  export let fetch: Function;
  export let direction: 'up' | 'down' = 'down';
  export let threshold = 1;
  export let refetchThreshold = 50;

  let hasFetched = false;
  let isLoading = false;

  const fetchOnTop = async () => {
    const scrollTop = element.scrollTop;

    if (hasFetched && scrollTop > refetchThreshold) {
      hasFetched = false;
    }

    if (scrollTop > threshold) {
      return;
    }

    if (isLoading || hasFetched) {
      return;
    }

    const scrollHeightBefore = element.scrollHeight;

    isLoading = true;

    await fetch();

    hasFetched = true
    isLoading = false;

    await tick();

    const scrollHeightAfter = element.scrollHeight;
    const heightDifference = scrollHeightAfter - scrollHeightBefore;

    element.scrollTop += heightDifference;
  };

  const fetchOnBottom = async () => {
    const { scrollTop, scrollHeight, clientHeight } = element;

    if (hasFetched && ((scrollTop + clientHeight) < (scrollHeight - refetchThreshold))) {
      hasFetched = false;
    }

    if ((scrollTop + clientHeight) <= (scrollHeight - threshold)) {
      return;
    }

    if (isLoading || hasFetched) {
      return;
    }

    isLoading = true;

    await tick();
    scrollToBottom(element);
    await fetch();

    hasFetched = true;
    isLoading = false;
  }

	onMount(() => {
		if (!element) {
			return;
		}

		element.addEventListener('scroll', async () => {
			if (direction == 'up') {
        await fetchOnTop();
      } else {
        await fetchOnBottom();
      }
		});
	});

	onDestroy(() => {
    if (element) {
      element.removeEventListener('scroll', () => {});
    }
	});
</script>

{#if isLoading}
  <div class="flex w-full justify-center items-center py-4">
    <LoaderCircle class="animate-spin w-8 h-8" />
  </div>
{/if}