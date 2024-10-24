<script>
	import { onMount } from 'svelte';

	import LoadingPage from '$lib/components/module/page/LoadingPage.svelte';

	import * as AuthAPI from '$api/auth-api';

	onMount(async () => {
		await AuthAPI.logout();

		const newUrl = '/';
		window.location.href = newUrl;
	});
</script>

<LoadingPage />
