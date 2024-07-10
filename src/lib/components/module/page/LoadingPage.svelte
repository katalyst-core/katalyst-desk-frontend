<script>
  import { LoaderCircle } from "lucide-svelte";

  export let loading = true;
</script>

{#if loading}
  <div class="flex w-full h-full justify-center items-center">
    <LoaderCircle class="animate-spin w-12 h-12" />
  </div>
{:else}
  <slot />
{/if}