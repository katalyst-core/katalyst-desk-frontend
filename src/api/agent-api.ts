import { fetchApi } from '$lib/custom-fetch';

import type { ApiResponse } from '$types/api-type';
import type { AgentInfoResponse } from '$types/agent-type';
import { agent } from '$stores/agent';
import { redirect } from '$utils/index';
import toast from 'svelte-french-toast';

export const fetchAgent = async () => {
	const response: ApiResponse<AgentInfoResponse> | null = await fetchApi('/agent/info');

	if (!response) {
		return;
	}

	if (!response.ok) {
		agent.set(null);

		// Redirect to sign-in if agent is not logged in while in the app
		await redirect([/^\/app\/.*$/, /^\/app$/], '/auth/sign-in');

		return;
	}

	// Redirect to dashboard if agent is logged in
	await redirect([/^\/auth\/sign-in$/, /^\/auth\/sign-up$/, /^\/$/], '/app');

	const data = response.data;
	agent.set(data);
};

export const getAgentInfo = async () => {
	const response: ApiResponse<AgentInfoResponse> = await fetchApi('/agent/info');

	if (!response.ok) toast.error(response.message);

	return response;
};

export const modifyAgent = async (name: string) => {
	const response: ApiResponse = await fetchApi('/agent/modify', {
		method: 'POST',
		body: JSON.stringify({
			name
		})
	});

	if (!response.ok) toast.error(response.message);

	return response;
};
