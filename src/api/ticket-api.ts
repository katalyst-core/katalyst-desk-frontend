import { toast } from 'svelte-french-toast';
import { get } from 'svelte/store';

import { fetchApi } from '$lib/custom-fetch';
import type { ApiResponse, TableOptions } from '$types/api-type';
import type { TicketMessage } from '$types/message-type';
import { socket as _socket } from '$stores/socket-store';
import type { TicketDetails } from '$types/ticket-type';

export const getMessagesByTicketId = async (ticketId: string, page: number, limit: number = 25) => {
	try {
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
			return null;
		}

		return response;
	} catch (err) {
		void err;
		toast.error('An error occurred');
		return null;
	}
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
}

export const getTicketDetails = async (ticketId: string) => {
	try {
		const response: ApiResponse<TicketDetails> = await fetchApi(`/ticket/${ticketId}/details`);

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

export const wsReadMessagesByTicketId = async (ticketId: string) => {
	const socket = get(_socket);

	try {
		socket?.emit('ticket:read-message', { ticket_id: ticketId });
	} catch (err) {
		void err;
		toast.error('An error occurred');
		return null;
	}
};