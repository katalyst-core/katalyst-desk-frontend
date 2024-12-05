<script lang="ts">
	import { onMount } from 'svelte';

	import { LoadingPage } from '$module/page';
	import { AuthAPI } from '$api/index';
	import { goto } from '$app/navigation';

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get('token');

		if (token) {
			await AuthAPI.verifyEmail(token);
		}

		goto(`/auth/sign-in`, {
			invalidateAll: true
		});
	});
</script>

<LoadingPage />
