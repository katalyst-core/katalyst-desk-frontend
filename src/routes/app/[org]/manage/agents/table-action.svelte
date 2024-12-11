<script lang="ts">
	import { Ellipsis } from 'lucide-svelte';
	import { page } from '$app/stores';

	import * as DropdownMenu from '$ui/dropdown-menu';
	import { Button } from '$ui/button';

	import { OrganizationAPI } from '$api/.';
	import { agentHasPermission } from '$utils/index';
	import { AGENT_MANAGE } from '$lib/permissions';

	interface Props {
		agentId: string;
		callback?: (...args: any[]) => void;
	}

	let { agentId, callback }: Props = $props();

	let isLoading: boolean = $state(false);

	let orgId = $derived($page.params.org);

	const removeAgent = async () => {
		isLoading = true;

		await OrganizationAPI.removeAgent(agentId, orgId);

		callback?.();

		isLoading = false;
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				size="icon"
				class="relative size-8 p-0"
				disabled={isLoading}
			>
				<Ellipsis class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="min-w-40">
		<DropdownMenu.Item disabled={!agentHasPermission(AGENT_MANAGE)} onclick={removeAgent} class="text-red-500">Remove</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
