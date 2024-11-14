<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';
	import { onMount } from 'svelte';

	import LoadingPage from '$module/page/LoadingPage.svelte';

	import * as AgentAPI from '$api/agent-api';

	let isRequestLoading = true;

	onMount(async () => {
		await AgentAPI.fetchAgent();
		isRequestLoading = false;
	});
</script>

<div class="w-screen h-screen font-poppins overflow-auto bg-background text-foreground">
	<LoadingPage bind:loading={isRequestLoading}>
		<slot />
	</LoadingPage>
</div>

<Toaster />
