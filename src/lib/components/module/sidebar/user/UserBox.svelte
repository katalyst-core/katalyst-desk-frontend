<script lang="ts">
	import { onMount } from 'svelte';
  import { ChevronUp } from 'lucide-svelte';

  import * as Avatar from '$lib/components/ui/avatar';
	import { getTextInitials } from '$utils/index';
  import { agent } from '$stores/agent';
	import UserMenu from './UserMenu.svelte';

  let name = '';
  let email = '';
  let initials = '';
  let buttonWidth: number;

  const getAgentData = () => {
    agent.subscribe((agent) => {
      if (!agent) return;

      name = agent.name;
      email = agent.email;
      initials = getTextInitials(agent.name);
    })
  };

  onMount(() => {
    getAgentData();
  });
</script>

<UserMenu {buttonWidth}>
  <div bind:clientWidth={buttonWidth} class="flex justify-between items-center w-full h-16 px-2 select-none cursor-pointer text-left rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all">
    <div class="flex items-center gap-2">
      <Avatar.Root>
        <Avatar.Image src="" alt="" />
        <Avatar.Fallback class="font-medium">{initials}</Avatar.Fallback>
      </Avatar.Root>
      <div class="flex flex-col justify-center font-medium">
        <p class="w-40 truncate">{name}</p>
        <p class="w-40 truncate text-sm opacity-65">{email}</p>
      </div>
    </div>
    <ChevronUp class="w-6 h-6 mx-2" />
  </div>
</UserMenu>