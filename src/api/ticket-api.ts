import { toast } from 'svelte-french-toast';

import { fetchApi } from '$lib/custom-fetch';
import type { ApiResponse, TableOptions } from '$types/api-type';
import type { TicketMessage } from '$types/message-type';
import type { TicketDetails } from '$types/ticket-type';

export const getMessages = async (ticketId: string, page: number, limit: number = 25) => {
	const response: ApiResponse<TableOptions<TicketMessage[]>> = await fetchApi(
		`/ticket/${ticketId}/messages?` +
			new URLSearchParams({
				page: String(page),
				limit: String(limit)
			})
	);

	if (!response.ok) {
		const message = response.message;

		toast.error(message);
	}

	return response;
};

export const sendMessage = async (ticketId: string, text: string) => {
	try {
		const response: ApiResponse | null = await fetchApi(`/ticket/${ticketId}/send-message`, {
			method: 'POST',
			body: JSON.stringify({
				text
			})
		});

		if (!response || !response.ok) {
			const message = response?.message || 'Error';
			toast.error(message);
			return null;
		}
	} catch (err) {
		void err;
		toast.error('An error occurred');
		return null;
	}
};

export const getTicketDetails = async (ticketId: string) => {
	const response: ApiResponse<TicketDetails> = await fetchApi(`/ticket/${ticketId}/details`);

	if (!response.ok) {
		const message = response.message;

		toast.error(message);
	}

	return response;
};

export const closeTicket = async (ticketId: string) => {
	try {
		const response: ApiResponse = await fetchApi(`/ticket/${ticketId}/close`);

		if (!response.ok) {
			const message = response.message;

			toast.error(message);
			return null;
		}

		return response;
	} catch (err) {
		void err;
		toast.error('Error getting ticket details');
		return null;
	}
};

