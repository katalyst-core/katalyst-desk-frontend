import { toast } from 'svelte-french-toast';
import { fetchApi } from '$lib/custom-fetch';

import { availableOrganizations, selectedOrganization } from '$stores/organization-store';
import type { ApiResponse } from '$types/api-type';
import type { CreateOrganizationResponse, OrganizationListResponse } from '$types/organization-type';

export const fetchOrganizationList = async () => {
	const response: ApiResponse<OrganizationListResponse[]> | null =
		await fetchApi('/organization/get-all');

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
