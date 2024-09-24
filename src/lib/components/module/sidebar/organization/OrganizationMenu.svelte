<script lang="ts">
	import * as DropdownMenu from '$ui/dropdown-menu';
	import { CreateOrganizationDialog } from '$module/modal';

	import type { OrganizationListObject } from '$types/organization-type';
	import { selectedOrganization } from '$stores/organization-store';

	import OrganizationItem from './OrganizationItem.svelte';

	export let buttonWidth;
	export let disabled = false;
	export let organizationList: OrganizationListObject[] | null = null;
	export let selectedOrganizationData: OrganizationListObject | null;

	let openCreateOrganizationDialog: boolean = false;

	const toggleCreateStoreDialog = () =>
		(openCreateOrganizationDialog = !openCreateOrganizationDialog);

	const setCurrentOrganization = (orgId: string) => {
		if (selectedOrganizationData?.organization_id === orgId) {
			return;
		}

		selectedOrganization.set(orgId);
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="w-full" {disabled}>
		<slot />
	</DropdownMenu.Trigger>

	<DropdownMenu.Content style="width: {buttonWidth}px">
		<DropdownMenu.Label>My Organizations</DropdownMenu.Label>
		<DropdownMenu.Separator />
		{#if organizationList}
			{#each organizationList as org}
				<DropdownMenu.Item on:click={() => setCurrentOrganization(org.organization_id)}>
					<OrganizationItem
						name={org.name}
						active={org.organization_id === selectedOrganizationData?.organization_id}
					/>
				</DropdownMenu.Item>
			{/each}
		{/if}
		<DropdownMenu.Item on:click={toggleCreateStoreDialog}>
			<OrganizationItem name={null} />
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<CreateOrganizationDialog bind:open={openCreateOrganizationDialog} />
