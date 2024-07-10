<script lang="ts">
	import { onMount } from 'svelte';
  import { ArrowLeftRight } from 'lucide-svelte';

  import { user } from '$stores/user';
  import * as Avatar from '$lib/components/ui/avatar';
	import StoreMenu from './StoreMenu.svelte';

  let userData: any = null;
  let name = '';
  let username = '';
  let initials = '';
  let buttonWidth: number;

  const getInitials = (name: string) => {
    return name.split(' ').slice(0, 2).map((name) => name[0].toUpperCase()).join('');
  };

  onMount(() => {
    user.subscribe((user) => userData = user);

    if (!userData) return;

    name = userData.name;
    username = userData.username;
    initials = getInitials(userData?.name);
  });
</script>

<StoreMenu {buttonWidth}>
  <div bind:clientWidth={buttonWidth} class="flex justify-between items-center w-full h-14 px-2 select-none cursor-pointer text-left rounded-xl bg-transparent text-gray-800 hover:bg-gray-300 transition-all">
    <div class="flex gap-2">
      <Avatar.Root>
        <Avatar.Image src="" alt="" />
        <Avatar.Fallback class="font-medium">{initials}</Avatar.Fallback>
      </Avatar.Root>
      <div class="flex flex-col justify-center font-medium">
        <p class="w-40 truncate">{buttonWidth}</p>
      </div>
    </div>
    <ArrowLeftRight class="w-5 h-5 mx-2" />
  </div>
</StoreMenu>