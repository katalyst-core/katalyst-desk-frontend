<script lang="ts">
	import { Ellipsis } from 'lucide-svelte';
	import { page } from '$app/stores';

	import * as DropdownMenu from '$ui/dropdown-menu/index.js';
	import { OrganizationAPI } from '$api/index';
	import { Button } from '$ui/button';

	interface Props {
		teamId: string;
		callback?: () => void;
	};

	let { teamId, callback }: Props = $props();

	let isLoading: boolean = $state(false);

	let activeOrgId = $derived($page.params.org);

	const deleteTeam = async () => {
		isLoading = true;

		await OrganizationAPI.deleteTeam(teamId, activeOrgId);

		callback?.();

		isLoading = false;
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<Ellipsis class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="min-w-40">
		<DropdownMenu.Item onclick={deleteTeam} class="text-red-500">Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
