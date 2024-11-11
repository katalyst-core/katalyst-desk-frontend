<script lang="ts">
  import { onMount } from 'svelte';

  import { LoadingPage } from '$module/page';
  import { ChannelAPI } from '$api/index';
	import { goto } from '$app/navigation';

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      await ChannelAPI.authenticateInstagram(code, state);
    }

    goto(`/app/${state}/channel`, {
      invalidateAll: true
    });
  });
</script>

<LoadingPage />