<div class="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
  {#each Array.from({ length: 10 }) as _, i (i)}
    <div class="bg-red-400 aspect-video max-w-3xl rounded-xl"></div>
  {/each}
</div>