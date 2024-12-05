import toast from 'svelte-french-toast';

import { fetchApi } from '$lib/custom-fetch';
import type { ApiResponse } from '$types/api-type';
import type { AuthToken } from '$types/auth-type';
import { persistedAccessToken } from '$stores/authentication-store';

export const createAgent = async (name: string, email: string, password: string) => {
	const response = await fetchApi('/auth/create', {
		method: 'POST',
		withoutToken: true,
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

export const login = async (email: string, password: string) => {
	const response: ApiResponse<AuthToken> = await fetchApi('/auth/login', {
		method: 'POST',
		withoutToken: true,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username: email,
			password
		})
	});

	if (!response.ok) {
		const { message } = response;
		toast.error(message);
		return response;
	}

	return response;
};

export const logout = async () => {
	const response = await fetchApi('/auth/logout', {
		method: 'POST',
		withoutToken: true
	});

	if (!response) {
		return null;
	}

	if (!response.ok) {
		const { message } = response;
		toast.error(message);
	}

	persistedAccessToken.set('');

	return response;
};

export const refresh = async () => {
	const response: ApiResponse<AuthToken> | null = await fetchApi('/auth/refresh', {
		method: 'POST',
		withoutToken: true
	});

	if (!response) {
		return null;
	}

	if (!response.ok) {
		return;
		// const { message } = response;
		// toast.error(message);
	}

	return response;
};

export const getGatewayToken = async () => {
	const response: ApiResponse<AuthToken> = await fetchApi('/auth/gateway', {
		method: 'POST'
	});

	if (!response.ok) {
		const { message } = response;
		toast.error(message);
	}

	return response;
};

export const verifyEmail = async (token: string) => {
	const response: ApiResponse = await fetchApi('/auth/verify-email', {
		method: 'POST',
		body: JSON.stringify({
			token
		})
	});

	return response;
};
