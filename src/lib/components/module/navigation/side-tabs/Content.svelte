<script lang="ts">
	import type { Snippet } from 'svelte';
  import { Tabs } from 'bits-ui';

	import { cn } from '$lib/utils';
	import { ScrollArea } from '$ui/scroll-area';

  interface Props {
    class?: string;
    value: string;
    children: () => ReturnType<Snippet>;
  }

  let { value, class: className, children }: Props = $props();
</script>

<Tabs.Content class="w-full h-full" {value}>
  <ScrollArea class="w-full h-full">
    <div class={cn('flex flex-col items-start', className)}>
      {@render children()}
    </div>
  </ScrollArea>
</Tabs.Content>