<script lang="ts">
  import '../app.css';
  import { Toaster } from 'svelte-french-toast';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
	import { goto } from '$app/navigation'

	import { user } from '$stores/user';
	import { fetchApi } from '$lib/custom-fetch';
	import LoadingPage from '$lib/components/module/page/LoadingPage.svelte';;

  let isRequestLoading = true;

  const getUser = async () => {
    const response = await fetchApi('/user/info')

    if (!response.ok) {
      user.set(null);

      // Redirect to sign-in if user is not logged in while in the app
      await redirect([/^\/app\/.*$/], '/auth/sign-in');

      return;
    }

    // Redirect to dashboard if user is logged in
    await redirect([/^\/auth\/sign-in$/, /^\/auth\/sign-up/, /^\/$/], '/app/dashboard');

    const result = await response.json();
    user.set(result.data);
  };

  const redirect = async (origins: RegExp[], target: string) => {
    const path = $page.url.pathname;
    if (!path) {
      return;
    }

    for (const origin of origins) {
      const valid = origin.test(path);

      if (valid) {
        return await goto(target, {
          invalidateAll: true
        });
      }
    }
  }

  onMount(async () => {
    await getUser();
    isRequestLoading = false;
  })
</script>

<div class="w-screen h-screen font-open overflow-auto">
  <LoadingPage bind:loading={isRequestLoading}>
    <slot />
  </LoadingPage>
</div>

<Toaster />