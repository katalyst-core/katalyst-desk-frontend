import toast from "svelte-french-toast";

import { fetchApi } from "$lib/custom-fetch";
import type { ApiResponse } from "$types/api-type";
import type { AuthToken } from "$types/auth-type";

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
	const response: ApiResponse<AuthToken> | null = await fetchApi('/auth/login', {
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
    const { message } = response;
    toast.error(message);
  }

  return response;
}