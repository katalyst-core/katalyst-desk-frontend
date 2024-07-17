<script lang="ts">
  import { ChevronDown } from "lucide-svelte";
	import type { Component } from "lucide-svelte";
  import { page } from '$app/stores';

  export let label: string;
  export let icon: typeof Component;
  export let path: string;
  export let hasChildren: boolean;
  export let open: boolean = false;

  $: browserPath = $page.url.pathname;

  open = hasChildren ? $page.url.pathname.startsWith(path) : false;
</script>

<li class="sidebar-item">
  <a href={!hasChildren ? path : null} on:click={() => open = !open} class="justify-between {browserPath == path ? 'sidebar-item-selected' : ''}">
    <div class="flex gap-4">
      <svelte:component this={icon} class="w-6 h-6" />
      <span>{label}</span>
    </div>
    {#if hasChildren}
      <ChevronDown class="w-6 h-6 text-gray-700 { open ? 'rotate-180' : '' } transition-transform" />
    {/if}
  </a>
</li>