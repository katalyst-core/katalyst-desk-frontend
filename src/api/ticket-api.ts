import { toast } from 'svelte-french-toast';
import { get } from 'svelte/store';

import { fetchApi } from '$lib/custom-fetch';
import type { ApiResponse, TableOptions } from '$types/api-type';
import type { TicketMessage } from '$types/message-type';
import { socket as _socket } from '$stores/socket-store';

const socket = get(_socket);

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

export const wsReadMessagesByTicketId = async (ticketId: string) => {
	try {
		socket?.emit('ticket:read-message', { ticket_id: ticketId });
	} catch (err) {
		void err;
		toast.error('An error occurred');
		return null;
	}
};