<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { LoadingPage } from '$module/page';

	import { orgTarget } from '$utils/index';

	onMount(async () => {
		await goto(orgTarget(`/dashboard`) || '#', {
			invalidateAll: true
		});
	});
</script>

<LoadingPage />
