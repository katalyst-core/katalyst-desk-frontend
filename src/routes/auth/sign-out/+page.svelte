<script>
	import { onMount } from 'svelte';

	import { LoadingPage } from '$module/page';

	import * as AuthAPI from '$api/auth-api';

	onMount(async () => {
		await AuthAPI.logout();

		const newUrl = '/';
		window.location.href = newUrl;
	});
</script>

<LoadingPage />
