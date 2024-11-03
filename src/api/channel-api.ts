import { toast } from 'svelte-french-toast';

import { fetchApi } from '$lib/custom-fetch';
import type { ApiResponse } from '$types/api-type';
import type { ChannelAccount } from '$types/channel-type';

export const sendInstagramAuth = async (code: string, organizationId: string) => {
	try {
		const response: ApiResponse | null = await fetchApi('/channel/instagram/auth', {
			method: 'POST',
			body: JSON.stringify({
				code,
				organization_id: organizationId,
			})
		});

		if (!response) {
			toast.error('Failed to authenticate');
			return null;
		}

		return response;
	} catch (err) {
		void err;
		toast.error('Failed to add channel');
		return null;
	}
};

export const getChannelAccounts = async (organizationId: string) => {
	try {
		const response: ApiResponse<ChannelAccount[]> | null = await fetchApi('/channel/accounts', {
			params: {
				organization_id: organizationId
			}
		});

		if (!response) {
			return null;
		}

		if (!response.ok) {
			const { message } = response;
			toast.error(message);
		}

		return response;
	} catch (err) {
		void err;
		toast.error('Failed to get channel accounts');
	}
}

export const deleteChannelAccount = async (channelAccountId: string) => {
	try {
		const response: ApiResponse | null = await fetchApi('/channel/account', {
			method: 'DELETE',
			body: JSON.stringify({
				channel_account_id: channelAccountId
			})
		});

		if (!response) {
			return null;
		}

		if (!response.ok) {
			const { message } = response;
			toast.error(message);
		}

		return response;
	} catch (err) {
		void err;
		toast.error('Failed to get channel accounts');
	}
}
