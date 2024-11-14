import { toast } from 'svelte-french-toast';
import { fetchApi } from '$lib/custom-fetch';

import type { ApiResponse, TableOptions } from '$types/api-type';
import type { CreateOrganizationResponse, OrganizationListItem } from '$types/organization-type';
import type { TicketListItem } from '$types/ticket-type';
import type { TeamListItem } from '$types/team-type';

// Move this to agent
export const fetchOrganizationList = async () => {
	const response: ApiResponse<OrganizationListItem[]> | null =
		await fetchApi('/agent/organizations');

	if (!response.ok) {
		toast.error('Unable to get organizations');
		return;
	}

	return response;
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

export const getTicketsByOrgId = async (orgId: string, page: number, limit: number = 25) => {
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

export const getTeamsByOrgId = async (orgId: string) => {
	try {
		const response: ApiResponse<TeamListItem[]> | null = await fetchApi(
			`/organization/${orgId}/teams`
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

export const createTeam = async (name: string, orgId: string) => {
	try {
		const response: ApiResponse | null = await fetchApi(
			`/organization/${orgId}/team`,
			{
				method: 'POST',
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

export const deleteTeam = async (teamId: string, orgId: string) => {
	try {
		const response: ApiResponse | null = await fetchApi(
			`/organization/${orgId}/team/${teamId}`,
			{
				method: 'DELETE',
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

