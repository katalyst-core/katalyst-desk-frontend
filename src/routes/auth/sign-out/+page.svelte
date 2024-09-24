<script>
	import { onMount } from 'svelte';

	import LoadingPage from '$lib/components/module/page/LoadingPage.svelte';

	import * as AgentAPI from '$api/agent-api';

	onMount(async () => {
		await AgentAPI.logoutAgent();

		const newUrl = '/';
		window.location.href = newUrl;
	});
</script>

<LoadingPage />
