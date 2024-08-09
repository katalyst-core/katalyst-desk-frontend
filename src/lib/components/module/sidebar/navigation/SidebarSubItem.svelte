<script lang="ts">
  import { page } from '$app/stores';

  export let label: string;
  export let path: string;

  $: browserPath = $page.url.pathname;
</script>

<div class="flex h-12 w-full items-center">
  <div class="w-[2px] h-full ml-[22px] mr-4 bg-gray-200"></div>

  <li class="sidebar-item">
    <a href={path} class="{browserPath == path ? 'sidebar-item-selected' : ''}">
      {label}
    </a>
  </li>
</div>