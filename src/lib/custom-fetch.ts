import { PUBLIC_BASE_API } from '$env/static/public';
import type { ApiResponse } from '$types/api';
import { parse } from 'cookie';

interface RequestConfig extends RequestInit {
	noRefresh?: boolean;
}

let controller: AbortController | null = null;

export async function fetchApi<T>(
	input: RequestInfo | URL,
	init?: RequestConfig
): Promise<ApiResponse<T> | null> {
	if (controller) {
		controller.abort();
	}

	controller = new AbortController();
	const { signal } = controller;

	if (init && init.method && ['POST', 'DELETE'].includes(init.method)) {
		init = {
			headers: {
				'Content-Type': 'application/json'
			},
			...init
		}
	}

	try {
		const originalPath = `${PUBLIC_BASE_API}${input}`;
		let response = await fetch(originalPath, { ...init, signal });

		// Request fails
		if (response.status === 401 && !init?.noRefresh) {
			// Refresh user's access token
			const refreshToken = getCookie('Refresh');
			if (refreshToken) {
				const refreshPath = `${PUBLIC_BASE_API}/agent/auth/refresh`;
				const refresh = await fetch(refreshPath, { method: 'POST' });

				if (!refresh.ok) {
					// Refresh token
					const logoutPath = `${PUBLIC_BASE_API}/agent/auth/logout`;
					response = await fetch(logoutPath, { method: 'POST' });
				} else {
					// Retry request
					response = await fetch(originalPath, { ...init, signal });
				}
			}
		}

		const { ok } = response;
		const data = await response.json();

		return {
			ok,
			...data
		};
	} catch (err) {
		void err;
	}

	return null;
}

const getCookie = (name: string) => {
	const cookies = parse(document.cookie);
	return cookies[name];
};
