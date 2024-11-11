<script>
	import { Plus } from 'lucide-svelte';

	import * as Avatar from '$ui/avatar';
	import { Button } from '$ui/button';

	import { availableOrganizations } from '$stores/organization-store';
	import { getTextInitials, textToColor } from '$utils/index';

	let orgs = $derived($availableOrganizations);
</script>

<div class="w-full h-full flex flex-col justify-center items-center space-y-6">
	<h1 class="text-center">Pick an organization to get started</h1>
	<ul class="flex flex-wrap max-w-[50rem] justify-center gap-2">
		{#if orgs}
			{#each orgs as org}
				{@const { name, organization_id } = org}
        {@const color = textToColor(name)}
        {@const initials = getTextInitials(name)}
				<Button href="/app/{organization_id}/dashboard" variant="outline" class="w-96 h-18">
					<Avatar.Root class="w-8 h-8">
						<Avatar.Image src="" alt="" />
						<Avatar.Fallback
							class="font-semibold text-gray-700 border-dotted border-gray-500 {color} {!name
								? 'border-2'
								: ''}"
						>
							{#if name}
								{initials}
							{:else}
								<Plus class="w-3 h-3" />
							{/if}
						</Avatar.Fallback>
					</Avatar.Root>
					<span>{name}</span>
				</Button>
			{/each}
		{/if}
	</ul>
</div>
