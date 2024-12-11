<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';
	import { onMount, type Snippet } from 'svelte';
	import { ModeWatcher } from "mode-watcher";

	import { LoadingPage } from '$module/page';

	import * as AgentAPI from '$api/agent-api';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let isRequestLoading = $state(true);

	onMount(async () => {
		await AgentAPI.fetchAgent();
		isRequestLoading = false;
	});
</script>

<ModeWatcher defaultMode="system" />

<div class="w-screen h-screen font-poppins overflow-auto bg-background text-foreground">
	<LoadingPage bind:loading={isRequestLoading}>
		{@render children()}
	</LoadingPage>
</div>

<Toaster />
