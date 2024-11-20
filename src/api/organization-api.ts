import { toast } from 'svelte-french-toast';
import { fetchApi } from '$lib/custom-fetch';

import type { ApiResponse, TableOptions } from '$types/api-type';
import type { CreateOrganizationResponse, OrganizationListItem } from '$types/organization-type';
import type { TicketListItem } from '$types/ticket-type';
import type { TeamListItem } from '$types/team-type';
import type { ChannelAccount } from '$types/channel-type';
import type { AgentListItem } from '$types/agent-type';
import type { TableQueryOption } from '$types/table-type';

export const getOrganizations = async () => {
	const response: ApiResponse<OrganizationListItem[]> = await fetchApi('/agent/organizations');

	if (!response.ok) {
		toast.error('Unable to get organizations');
	}

	return response;
};

export const createOrganization = async (name: string) => {
	const response: ApiResponse<CreateOrganizationResponse> = await fetchApi('/organization/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name
		})
	});

	if (!response.ok) {
		const message = response.message;

		toast.error(message);
	}

	return response;
};

export const getChannels = async (orgId: string) => {
	const response: ApiResponse<ChannelAccount[]> = await fetchApi(`/organization/${orgId}/channels`);

	if (!response.ok) {
		const { message } = response;
		toast.error(message);
	}

	return response;
};

export const getTickets = async (orgId: string, page: number, limit: number = 25) => {
	const response: ApiResponse<TableOptions<TicketListItem[]>> = await fetchApi(
		`/organization/${orgId}/tickets?` +
			new URLSearchParams({
				page: String(page),
				limit: String(limit)
			})
	);

	if (!response.ok) {
		const message = response.message;

		toast.error(message);
	}

	return response;
};

export const getTeams = async (orgId: string) => {
	const response: ApiResponse<TeamListItem[]> = await fetchApi(`/organization/${orgId}/teams`);

	if (!response.ok) {
		const message = response.message;

		toast.error(message);
	}

	return response;
};

export const createTeam = async (name: string, orgId: string) => {
	const response: ApiResponse = await fetchApi(`/organization/${orgId}/team`, {
		method: 'POST',
		body: JSON.stringify({
			name
		})
	});

	if (!response.ok) {
		const message = response.message;

		toast.error(message);
	}

	return response;
};

export const getAgents = async (orgId: string, tableOptions: TableQueryOption) => {
	const { page } = tableOptions;

	const response: ApiResponse<TableOptions<AgentListItem[]>> = await fetchApi(
		`/organization/${orgId}/agents`,
		{
			params: {
				page: String(page || '1')
			}
		}
	);

	if (!response.ok) {
		const message = response.message;

		toast.error(message);
	}

	return response;
};

export const addAgent = async (email: string, orgId: string) => {
	const response: ApiResponse = await fetchApi(`/organization/${orgId}/agent`, {
		method: 'POST',
		body: JSON.stringify({
			email
		})
	});

	return response;
};

export const removeAgent = async (agentId: string, orgId: string) => {
	const response: ApiResponse = await fetchApi(`/organization/${orgId}/agent/${agentId}`, {
		method: 'DELETE'
	});

	if (!response.ok) {
		const message = response.message;

		toast.error(message);
	}

	return response;
};

export const getUnassignedTeams = async (orgId: string, agentId: string) => {
	const response: ApiResponse<TeamListItem[]> = await fetchApi(
		`/organization/${orgId}/agent/${agentId}/unassigned-teams`
	);

	if (!response.ok) {
		const message = response.message;

		toast.error(message);
	}

	return response;
};

export const assignTeamToAgent = async (orgId: string, agentId: string, teamId: string) => {
	const response: ApiResponse = await fetchApi(
		`/organization/${orgId}/assign-team`,
		{
			method: 'POST',
			body: JSON.stringify({
				team_id: teamId,
				agent_id: agentId
			})
		}
	);

	if (!response.ok) {
		const message = response.message;

		toast.error(message);
	}

	return response;
};

export const unassignTeamFromAgent = async (orgId: string, agentId: string, teamId: string) => {
	const response: ApiResponse = await fetchApi(
		`/organization/${orgId}/unassign-team`,
		{
			method: 'POST',
			body: JSON.stringify({
				team_id: teamId,
				agent_id: agentId
			})
		}
	);

	if (!response.ok) {
		const message = response.message;

		toast.error(message);
	}

	return response;
};