<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { number } from 'zod';

  export let buttonWidth;

  const generateColor = (text: string) => {
    const chars = text.split('');
    let count = 0;
    chars.forEach((char) => count += char.charCodeAt(0));

    const colors = [
      'bg-red-600',
      'bg-blue-600'
    ];

    return colors[(count % colors.length)];
  };
</script>


<DropdownMenu.Root>
  <DropdownMenu.Trigger class="w-full">
    <slot />
  </DropdownMenu.Trigger>

  <DropdownMenu.Content style="width: {buttonWidth}px">
    <DropdownMenu.Label>My Account</DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.Item href="/auth/sign-out" class="flex gap-2 cursor-pointer">
      <Avatar.Root class="w-8 h-8">
        <Avatar.Image src="" alt=""/>
        <Avatar.Fallback class="font-semibold text-gray-100 {generateColor('Authenity')}">JT</Avatar.Fallback>
      </Avatar.Root>
      <div class="flex flex-col justify-center font-medium">
        <p class="w-40 truncate">{generateColor('Authenity')}</p>
      </div>
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>