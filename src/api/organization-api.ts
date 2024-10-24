import { toast } from 'svelte-french-toast';
import { fetchApi } from '$lib/custom-fetch';

import { availableOrganizations, selectedOrganization } from '$stores/organization-store';
import type { ApiResponse, TableOptions } from '$types/api-type';
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

export const getTicketsByOrgId = async (orgId: string, page: number, limit: number = 15) => {
	try {
		const response: ApiResponse<TableOptions<TicketListItem[]>> | null = await fetchApi(
			`/organization/${orgId}/tickets?` +
				new URLSearchParams({
					page: String(page),
					limit: String(limit)
				})
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
