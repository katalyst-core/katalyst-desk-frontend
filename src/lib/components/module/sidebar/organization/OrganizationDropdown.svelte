<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowLeftRight } from 'lucide-svelte';

	import * as Avatar from '$ui/avatar';
	import { Skeleton } from '$ui/skeleton';
	import OrganizationMenu from './OrganizationMenu.svelte';

	import { getTextInitials, textToColor } from '$utils/index';
	import type { OrganizationListObject } from '$types/organization-type';
	import { availableOrganizations, selectedOrganization } from '$stores/organization-store';

	let organizationList: OrganizationListObject[] | null;
	let selectedOrganizationData: OrganizationListObject | null;
	let organizationName = 'Choose one';
	let buttonWidth: number;

	$: initials = getTextInitials(organizationName);
	$: avatarColor = textToColor(organizationName);

	const getAvailableOrganizations = () => availableOrganizations.subscribe((org) => organizationList = org);

	const getSelectedOrganization = async () => {
		selectedOrganization.subscribe((orgId) => {
			if (orgId === null || organizationList === null) {
				selectedOrganizationData = null;
				return;
			}

			selectedOrganizationData = organizationList.find((org) => org.organization_id === orgId) || null;

			if (selectedOrganizationData === null) {
				return;
			}

			organizationName = selectedOrganizationData.name;
		});
	}

	onMount(() => {
		getAvailableOrganizations();
		getSelectedOrganization();
	});
</script>

<OrganizationMenu {buttonWidth} {organizationList} {selectedOrganizationData} disabled={!organizationList}>
	<div
		bind:clientWidth={buttonWidth}
		class="flex justify-between items-center w-full h-14 px-2 select-none cursor-pointer text-left rounded-xl bg-transparent text-gray-800 hover:bg-gray-200 transition-all"
	>
		{#if !!organizationList}
			<div class="flex gap-2">
				<Avatar.Root>
					<Avatar.Image src="" alt="" />
					<Avatar.Fallback class="font-medium {avatarColor}">{initials}</Avatar.Fallback>
				</Avatar.Root>
				<div class="flex flex-col justify-center font-medium">
					<p class="w-40 truncate">{organizationName}</p>
				</div>
			</div>
			<ArrowLeftRight class="w-5 h-5 mx-2" />
		{:else}
			<div class="flex w-full gap-2 items-center">
				<Skeleton class="w-10 h-10 rounded-full" />
				<Skeleton class="w-40 h-4" />
			</div>
		{/if}
	</div>
</OrganizationMenu>
