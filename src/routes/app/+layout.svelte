<script lang="ts">
  import { onMount } from "svelte";

	import Sidebar from "$lib/components/module/sidebar/Sidebar.svelte";
	import { stores } from "$stores/store";
	import { fetchStores } from "$lib/services/store";
	import LoadingPage from "$lib/components/module/page/LoadingPage.svelte";
	import CreateStoreDialog from "$lib/components/module/modal/CreateStoreDialog.svelte";

  let hasStores = true;
  let openCreateStoreDialog = false;

  onMount(async () => {
    stores.subscribe((stores) => {
      if (!stores) {
        hasStores = false;
        return;
      }

      if (stores.length === 0) {
        hasStores = false;
        openCreateStoreDialog = true;
        return;
      }

      hasStores = true;
    });

    fetchStores();
  });
</script>

<Sidebar>
  <LoadingPage loading={!hasStores}>
    <div class="w-full h-full p-4">
      <slot />
    </div>
  </LoadingPage>
</Sidebar>

<CreateStoreDialog bind:open={openCreateStoreDialog} closeable={false} />