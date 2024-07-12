<script lang="ts">
	import { onMount } from 'svelte';
  import { ChevronUp } from 'lucide-svelte';

  import * as Avatar from '$lib/components/ui/avatar';
	import { getTextInitials } from '$lib/utils';
  import { user } from '$stores/user';
	import UserMenu from './UserMenu.svelte';
	import type { User } from './types';

  let userData: User | null = null;
  let name = '';
  let username = '';
  let initials = '';
  let buttonWidth: number;

  onMount(() => {
    user.subscribe((user) => userData = user);

    if (!userData) return;

    name = userData.name;
    username = userData.username;
    initials = getTextInitials(userData?.name);
  });
</script>

<UserMenu {buttonWidth}>
  <div bind:clientWidth={buttonWidth} class="flex justify-between items-center w-full h-16 px-2 select-none cursor-pointer text-left rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all">
    <div class="flex gap-2">
      <Avatar.Root>
        <Avatar.Image src="" alt="" />
        <Avatar.Fallback class="font-medium">{initials}</Avatar.Fallback>
      </Avatar.Root>
      <div class="flex flex-col justify-center font-medium">
        <p class="w-40 truncate">{name}</p>
        <p class="w-40 truncate text-sm opacity-65">{username}</p>
      </div>
    </div>
    <ChevronUp class="w-6 h-6 mx-2" />
  </div>
</UserMenu>