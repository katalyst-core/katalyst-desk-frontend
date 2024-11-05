import { fetchApi } from '$lib/custom-fetch';

import type { ApiResponse } from '$types/api-type';
import type { AgentInfoResponse } from '$types/agent-type';
import { agent } from '$stores/agent';
import { redirect } from '$utils/index';

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
