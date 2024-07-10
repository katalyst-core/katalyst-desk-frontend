<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Eye, EyeOff } from "lucide-svelte";
	import type { HTMLInputAttributes } from "svelte/elements";
  import { cn } from "$lib/utils.js";

  type $$Props = HTMLInputAttributes;

  let className: $$Props["class"] = undefined;
  export let value: $$Props["value"] = undefined;
  export { className as class };

  let isHidden = true;
</script>

<div class="flex items-center justify-end">
  <Input class="pr-9" type={isHidden ? 'password' : 'text'} bind:value {...$$restProps} />
  <div class={cn(
    "absolute flex items-center mr-2",
    className
  )}>
    <button type="button" on:click|preventDefault={() => isHidden = !isHidden}>
      {#if isHidden}
        <Eye />
      {:else}
        <EyeOff />
      {/if}
    </button>
  </div>
</div>