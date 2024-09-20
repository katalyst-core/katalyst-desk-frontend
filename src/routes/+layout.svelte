<script lang="ts">
  import '../app.css';
  import { Toaster } from 'svelte-french-toast';
  import { onMount } from 'svelte';

	import LoadingPage from '$lib/components/module/page/LoadingPage.svelte';;
	import { fetchAgent } from '$lib/services/auth';

  let isRequestLoading = true;



  onMount(async () => {
    await fetchAgent();
    isRequestLoading = false;
  })
</script>

<div class="w-screen h-screen font-open overflow-auto">
  <LoadingPage bind:loading={isRequestLoading}>
    <slot />
  </LoadingPage>
</div>

<Toaster />