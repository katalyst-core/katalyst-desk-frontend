import { toast } from 'svelte-french-toast';

import { fetchApi } from '$lib/custom-fetch';
import type { ApiResponse } from '$types/api-type';

export const authenticateInstagram = async (code: string, organizationId: string) => {
	const response: ApiResponse | null = await fetchApi('/channel/instagram/auth', {
		method: 'POST',
		body: JSON.stringify({
			code,
			organization_id: organizationId
		})
	});

	if (!response) {
		toast.error('Failed to authenticate');
	}

	return response;
};

export const authenticateWhatsApp = async (
	phoneNumberId: string,
	wabaId: string,
	code: string,
	organizationId: string
) => {
	const response: ApiResponse = await fetchApi('/channel/whatsapp/auth', {
		method: 'POST',
		body: JSON.stringify({
			phone_number_id: phoneNumberId,
			waba_id: wabaId,
			code,
			organization_id: organizationId
		})
	});

	if (!response.ok) {
		toast.error('Failed to authenticate');
	}

	return response;
};

export const deleteChannel = async (channelId: string) => {
	const response: ApiResponse = await fetchApi(`/channel/${channelId}`, {
		method: 'DELETE'
	});

	if (!response.ok) {
		const { message } = response;
		toast.error(message);
	}

	return response;
};
