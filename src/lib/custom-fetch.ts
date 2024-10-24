import { PUBLIC_BASE_API, PUBLIC_ACCESS_PUBLIC_KEY } from '$env/static/public';
import { get } from 'svelte/store';
import * as jose from 'jose';

import * as AuthAPI from '$api/auth-api';
import type { ApiResponse } from '$types/api-type';
import { persistedAccessToken } from '$stores/authentication-store';

interface RequestConfig extends RequestInit {
	withoutToken?: boolean;
}

let controller: AbortController | null = null;

const ttoken = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA5XGsXFs9145E+0vuH+8N
K4RQLmlHhRlXPzOsVpWHUhaFS7upskiwjCyo2ero2K6o54PJqPAaAM7EMEkOaNUB
BjPfv9blctNmxQWDsQVRP3V76T8qjlBF5LV85zjXwbJktu7i3DkuzCNNQOUvzviX
UUmaj9M+NXpKbYPVUuZNUU8gd4l/QgZKL1VPuXRtHvhmdv3quRNjqlxFJ6y2r6GA
HbH7IbAm+tPDUtGLeX+pKtk2FV6ot2z6YS8AccHK/mE23q7mx/avJqCXgaOuNCEf
l4hwc/cGS3H2MgQVnjlkjILtaKFB4NlQ2l37vHhu7+1p4mslbMN8QXO+Q1ffi+Ep
VnSrIaWzVhDLvaxwy2D6o1Z7452i69l/o5jmPrkLnERVKYHbvq9th2heKEzijxqJ
/tFmatOFGAF9hMuJuvWm6gM3ylGo6TVltY750ubinUn8XcQKo//MraaFFODE8eKF
PbzGoet5jiJW/fgNsg4ZuZNmTX5OwHIRZSD4Y57BugY5/6cDgTuVAZOFzzsBjOuQ
D9pCKiDBli8n0pcFIOERVMkdiPGv+/MfOT/G9TYJVDj+2672dMNZbjBTFcFt/uO0
aKouqwfqhDslRP6bVO0Q/Wd9t/rD/qDV1LIzM1WUu4gVrFR6mxPLyTJSA5KP8QPI
RUNW90iuDDdulFW+OwPtjwkCAwEAAQ==
-----END PUBLIC KEY-----`;

const verifyToken = async (token: string, publicKeyPEM: string) => {
	if (typeof window === 'undefined') {
    console.error('JWT verification is only available in the browser.');
    return false;
  }

	try {
		const publicKey = await jose.importSPKI(ttoken, 'RS256');
		console.log(token, '---' ,publicKey);
		await jose.jwtVerify(token, publicKey);

		return true;
	} catch (err) {
		console.log(err);
		void err;
	}

	return false;
};

export async function fetchApi<T>(
	target: RequestInfo | URL,
	config?: RequestConfig
): Promise<ApiResponse<T> | null> {
	const accessToken = get(persistedAccessToken);

	// Cancels refetching
	if (controller) {
		controller.abort();
	}

	// Manages refetching
	controller = new AbortController();
	const { signal } = controller;

	// Apply access token to every request
	config = {
		headers: {
			Authorization: `Bearer ${accessToken}`
		},
		...config
	};

	// Apply the correct Content-Type for every "POST" request
	if (config && config.method && ['POST', 'PUT', 'DELETE'].includes(config.method)) {
		config = {
			headers: {
				'Content-Type': 'application/json',
				...config.headers
			},
			...config
		};
	}

	try {
		const verif = await verifyToken(accessToken, PUBLIC_ACCESS_PUBLIC_KEY);
		console.log(verif);
		console.log(target, config?.withoutToken);
		if (!verif && !config?.withoutToken) {
			const refresh = await AuthAPI.refresh();
			if (refresh && refresh.ok) {
				const newAuthToken = refresh.data.auth_token;
				persistedAccessToken.set(newAuthToken);
			} else {
				// Logout when refresh fails
				await AuthAPI.logout();
			}
		}

		const targetPath = `${PUBLIC_BASE_API}${target}`;
		const response = await fetch(targetPath, { ...config, signal, credentials: 'include' });

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
