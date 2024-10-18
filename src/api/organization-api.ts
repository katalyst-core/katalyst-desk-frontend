import { toast } from 'svelte-french-toast';
import { fetchApi } from '$lib/custom-fetch';

import { availableOrganizations, selectedOrganization } from '$stores/organization-store';
import type { ApiResponse } from '$types/api-type';
import type { CreateOrganizationResponse, OrganizationListItem } from '$types/organization-type';
import type { TicketListItem } from '$types/ticket-type';

// Move this to agent
export const fetchOrganizationList = async () => {
	const response: ApiResponse<OrganizationListItem[]> | null =
		await fetchApi('/agent/organizations');

	if (!response) {
		return;
	}

	if (!response.ok) {
		toast.error('Unable to retrieved stores');
		return;
	}

	const { data: organizations } = response;
	availableOrganizations.set(organizations);

	selectedOrganization.update((organization_id: string | null) => {
		if (organizations.length === 0) {
			return null;
		}

		if (organization_id == null) {
			return organizations[0].organization_id;
		}

		if (!organizations.find((o) => o.organization_id == organization_id)) {
			return organizations[0].organization_id;
		}

		return organization_id;
	});
};

export const createOrganization = async (name: string) => {
	try {
		const response: ApiResponse<CreateOrganizationResponse> | null = await fetchApi(
			'/organization/create',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name
				})
			}
		);

		if (!response) {
			return null;
		}

		if (!response.ok) {
			const message = response.message;

			toast.error(message);
		}

		return response;
	} catch (err) {
		void err;
		toast.error('An error occurred');
		return null;
	}
};

// TODO: rename to getTicketsByOrgId
export const getTickets = async (orgId: string) => {
	try {
		const response: ApiResponse<TicketListItem[]> | null = await fetchApi(
			`/organization/${orgId}/tickets`
		);

		if (!response) {
			return null;
		}

		if (!response.ok) {
			const message = response.message;

			toast.error(message);
		}

		return response;
	} catch (err) {
		void err;
		toast.error('An error occurred');
		return null;
	}
}
