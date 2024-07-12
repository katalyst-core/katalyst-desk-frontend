<script lang="ts">
	import { onMount } from 'svelte';

  import * as Avatar from '$lib/components/ui/avatar';
	import { getTextInitials, textToColor } from '$utils/index';
	import { Check, Plus } from 'lucide-svelte';

  export let name: string | null;
  export let active: boolean = false;

  let color = '';
  let initials = '';

  onMount(() => {
    if (!name) {
      return;
    }

    color = textToColor(name);
    initials = getTextInitials(name);
  });
</script>

<div class="flex w-full h-full justify-between items-center cursor-pointer">
  <div class="flex gap-2">
    <Avatar.Root class="w-8 h-8">
      <Avatar.Image src="" alt=""/>
      <Avatar.Fallback class="font-semibold text-gray-700 border-dotted border-gray-500 {color} {!name ? 'border-2' : ''}">
        {#if name}
          {initials}
        {:else}
          <Plus class="w-3 h-3" />
        {/if}
      </Avatar.Fallback>
    </Avatar.Root>
    <div class="flex flex-col justify-center font-medium">
      <p class="w-40 truncate">{name || 'Create new store'}</p>
    </div>
  </div>
  <Check class="w-5 h-5 {!active ? 'invisible' : ''}" />
</div>