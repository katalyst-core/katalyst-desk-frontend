<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { LogOut } from 'lucide-svelte';

  export let buttonWidth;
</script>


<DropdownMenu.Root>
  <DropdownMenu.Trigger class="w-full">
    <slot />
  </DropdownMenu.Trigger>

  <DropdownMenu.Content style="width: {buttonWidth}px">
    <DropdownMenu.Label>My Account</DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.Item href="/auth/sign-out" class="cursor-pointer">
      <LogOut class="mr-2 w-4 h-4" />
      Sign Out
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>