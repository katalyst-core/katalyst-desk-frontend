import { toast } from 'svelte-french-toast';
import { fetchApi } from '$lib/custom-fetch';

import type { ApiResponse } from '$types/api-type';
import type { AgentInfoResponse } from '$types/agent-type';
import { agent } from '$stores/agent';
import { redirect } from '$utils/index';

export const createAgent = async (name: string, email: string, password: string) => {
	const response = await fetchApi('/agent/auth/create', {
		method: 'POST',
		noRefresh: true,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name,
			email,
			password
		})
	});

	if (!response) {
		return null;
	}

	if (!response.ok) {
		const { message } = response;
		toast.error(message);
		return response;
	}

	return response;
};

export const loginAgent = async (email: string, password: string) => {
	const response = await fetchApi('/agent/auth/login', {
		method: 'POST',
		noRefresh: true,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username: email,
			password
		})
	});

	if (!response) {
		return null;
	}

	if (!response.ok) {
		const { message } = response;
		toast.error(message);
		return response;
	}

	return response;
};

export const logoutAgent = async () => {
  const response = await fetchApi('/agent/auth/logout', {
    method: 'POST',
    noRefresh: true
  });

  if (!response) {
    return null;
  }

  if (!response.ok) {
    const { message } = response;
    toast.error(message);
  }

  return response;
};

export const fetchAgent = async () => {
	const response: ApiResponse<AgentInfoResponse> | null = await fetchApi('/agent/info');

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
