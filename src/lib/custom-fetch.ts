import { PUBLIC_BASE_API, PUBLIC_ACCESS_PUBLIC_KEY } from '$env/static/public';
import { get } from 'svelte/store';
import * as jose from 'jose';

import * as AuthAPI from '$api/auth-api';
import type { ApiResponse } from '$types/api-type';
import { persistedAccessToken } from '$stores/authentication-store';

interface RequestConfig extends RequestInit {
	withoutToken?: boolean;
}

// let controller: AbortController | null = null;

const verifyToken = async (token: string, publicKeyPEM: string) => {
	try {
		const publicKey = await jose.importSPKI(publicKeyPEM, 'RS256');
		await jose.jwtVerify(token, publicKey);

		return true;
	} catch (err) {
		void err;
	}

	return false;
};

export async function fetchApi<T>(
	target: RequestInfo | URL,
	config?: RequestConfig
): Promise<ApiResponse<T> | null> {
	// Cancels refetching
	// if (controller) {
	// 	controller.abort();
	// }

	// Manages refetching
	// controller = new AbortController();
	// const { signal } = controller;

	// Apply the correct Content-Type for every "POST" request
	if (config && config.method && ['POST', 'PUT', 'DELETE'].includes(config.method)) {
		config = {
			...config,
			headers: {
				'Content-Type': 'application/json',
				...config.headers
			}
		};
	}

	try {
		let accessToken = get(persistedAccessToken);

		const isTokenValid = await verifyToken(accessToken, PUBLIC_ACCESS_PUBLIC_KEY);
		if (!isTokenValid && !config?.withoutToken) {
			// Refresh tokens
			const refresh = await AuthAPI.refresh();
			if (refresh && refresh.ok) {
				// Replace access token
				const newAccessToken = refresh.data.auth_token;
				persistedAccessToken.set(newAccessToken);
				accessToken = newAccessToken;
			} else {
				// Logout when refresh fails
				await AuthAPI.logout();
			}
		}

		// Apply access token to every request
		config = {
			...config,
			headers: {
				Authorization: `Bearer ${accessToken}`,
				...config?.headers
			}
		};

		// Continue fetch
		const targetPath = `${PUBLIC_BASE_API}${target}`;
		const response = await fetch(targetPath, { ...config, credentials: 'include' });

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
