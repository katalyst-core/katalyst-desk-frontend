import { fetchApi } from '$lib/custom-fetch';
import { agent } from '$stores/agent';
import type { ApiResponse } from '$types/api';
import type { UserObject } from '$types/user';

import { redirect } from '$utils/index';

export const fetchAgent = async () => {
	const response: ApiResponse<UserObject> | null = await fetchApi('/agent/info');

	if (!response) {
		return;
	}

	if (!response.ok) {
		agent.set(null);

		// Redirect to sign-in if user is not logged in while in the app
		await redirect([/^\/app\/.*$/], '/auth/sign-in');

		return;
	}

	// Redirect to dashboard if user is logged in
	await redirect([/^\/auth\/sign-in$/, /^\/auth\/sign-up/, /^\/$/], '/app/dashboard');

	const data = response.data;
	agent.set(data);
};
