import { toast } from 'svelte-french-toast';

import { fetchApi } from '$lib/custom-fetch';
import type { ApiResponse, TableOptions } from '$types/api-type';
import type { TicketMessage } from '$types/message-type';

export const getMessagesByTicketId = async (ticketId: string, page: number, limit: number = 15) => {
	try {
		const response: ApiResponse<TableOptions<TicketMessage[]>> | null = await fetchApi(
			`/ticket/${ticketId}/messages?` +
				new URLSearchParams({
          page: String(page),
					limit: String(limit)
				})
		);

		if (!response) {
			return null;
		}

		if (!response.ok) {
			const message = response.message;

			toast.error(message);
		}

		return response;
	} catch (err) {
		void err;
		toast.error('An error occurred');
		return null;
	}
};

export const readMessagesByTicketId = async (ticketId: string) => {
	try {
		const response: ApiResponse<TicketMessage[]> | null = await fetchApi(
			`/ticket/${ticketId}/read-messages`,
			{
				method: 'POST'
			}
		);

		if (!response) {
			return null;
		}

		if (!response.ok) {
			const message = response.message;

			toast.error(message);
		}

		return response;
	} catch (err) {
		void err;
		toast.error('An error occurred');
		return null;
	}
};
