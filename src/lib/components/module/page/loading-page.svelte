<script lang="ts">
	import type { Snippet } from 'svelte';
	import { LoaderCircle } from 'lucide-svelte';

	interface Props {
		loading?: boolean;
		children?: Snippet;
	}

	let { loading = $bindable(true), children }: Props = $props();
</script>

{#if loading}
	<div class="flex w-full h-full justify-center items-center">
		<LoaderCircle class="animate-spin w-12 h-12" />
	</div>
{:else}
	{@render children?.()}
{/if}
