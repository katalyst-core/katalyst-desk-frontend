<script lang="ts">
	import type { Snippet } from 'svelte';

	import * as DropdownMenu from '$ui/dropdown-menu';
	import { CreateOrganizationDialog } from '$module/modal';
	import { OrganizationItem } from '.';

	import type { OrganizationListItem } from '$types/organization-type';


	interface Props {
		disabled: boolean;
		organizationList: OrganizationListItem[] | null;
		selectedOrganization: OrganizationListItem | null;
		children: Snippet<
			[
				{
					props: Record<string, unknown>;
				}
			]
		>;
	}

	let { disabled = false, organizationList = null, selectedOrganization, children }: Props = $props();

	let openCreateOrganizationDialog: boolean = $state(false);

	const toggleCreateStoreDialog = () =>
		(openCreateOrganizationDialog = !openCreateOrganizationDialog);

</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="w-full" {disabled}>
		{#snippet child(props)}
			{@render children(props)}
		{/snippet}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content class="w-[--bits-dropdown-menu-anchor-width]">
		<DropdownMenu.Label>My Organizations</DropdownMenu.Label>
		<DropdownMenu.Separator />
		{#if organizationList}
			{#each organizationList as org}
			{@const { organization_id: orgId } = org}
				<DropdownMenu.Item>
					<a href="/app/{orgId}/dashboard">
						<OrganizationItem
							name={org.name}
							active={org.organization_id === selectedOrganization?.organization_id}
						/>
					</a>
				</DropdownMenu.Item>
			{/each}
		{/if}
		<DropdownMenu.Item onclick={toggleCreateStoreDialog}>
			<OrganizationItem name={null} />
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<CreateOrganizationDialog bind:open={openCreateOrganizationDialog} />
