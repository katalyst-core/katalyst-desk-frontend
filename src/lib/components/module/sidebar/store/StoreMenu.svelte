<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
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
    <DropdownMenu.Item href="/auth/sign-out" class="flex gap-2 cursor-pointer">
      <Avatar.Root class="w-8 h-8 bg-orange-600">
        <Avatar.Image src="" alt="" class="bg-orange-600" />
        <Avatar.Fallback class="font-medium">J</Avatar.Fallback>
      </Avatar.Root>
      <div class="flex flex-col justify-center font-medium">
        <p class="w-40 truncate">Authenity</p>
      </div>
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>