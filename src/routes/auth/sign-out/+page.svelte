<script>
	import { onMount } from 'svelte';

	import LoadingPage from '$lib/components/module/page/LoadingPage.svelte';
	import { fetchApi } from '$lib/custom-fetch';

	onMount(async () => {
		await fetchApi('/auth/logout', {
			method: 'POST',
			noRefresh: true
		});

		const newUrl = '/';
		window.location.href = newUrl;
	});
</script>

<LoadingPage />
