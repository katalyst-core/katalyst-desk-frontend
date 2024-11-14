<script lang="ts">
	import { page } from "$app/stores";
  import { Button } from "$ui/button";
	import { orgTarget } from "$utils/index";

  let pathName = $derived($page.url.pathname);

  type SideMenuItem = {
    name: string;
    target: string;
  };

  let items = [
    {
      name: 'Agents',
      target: '/manage/agents'
    },
    {
      name: 'Teams',
      target: '/manage/teams'
    }
  ];

</script>

<ul class="flex flex-col w-full space-y-1">
  {#each items as item}
  {@const isActive = pathName === orgTarget(item.target)}

    <li class="w-full">
      <Button href={orgTarget(item.target)} variant="ghost" size="lg" class="w-full justify-start { isActive && 'bg-muted' }">
        <span>
          {item.name}
        </span>
      </Button>
    </li>
  {/each}
</ul>