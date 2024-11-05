<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';

	import { ChatWindow } from '$module/page/chat';

	import * as TicketAPI from '$api/ticket-api';
	import { goto } from '$app/navigation';
	import { orgTarget } from '$utils/index';
	import { socket } from '$stores/socket-store';
	import type { TicketMessage, WsTicketMessage } from '$types/message-type';

	let ticketId = $derived($page.params.ticket);
	let messages: TicketMessage[] | null = $state(null);
	let currentMessagesPage = $state(1);

	$effect(() => {
		getMessages();
	});

	const redirectOut = async () => {
		return await goto(orgTarget('/ticket') || '/app', {
			invalidateAll: true
		});
	};

	const getMessages = async () => {
		if (!ticketId) {
			return redirectOut();
		}

		currentMessagesPage = 1;
		messages = null;

		const response = await TicketAPI.getMessagesByTicketId(ticketId, 1);

		if (!response || !response.ok) {
			return redirectOut();
		}

		messages = response.data.result;

		TicketAPI.wsReadMessagesByTicketId(ticketId);
	};

	const getMoreMessages = async () => {
		if (!ticketId || !messages) return redirectOut();
		if (currentMessagesPage === -1) return;

		const response = await TicketAPI.getMessagesByTicketId(ticketId, ++currentMessagesPage);
		if (!response || !response.ok) return redirectOut();

		const {
			result: newMessages,
			pagination: { total_page: totalPage }
		} = response.data;

		if (currentMessagesPage > totalPage) {
			currentMessagesPage = -1;
			return;
		}

		messages.push(...newMessages);
	};

	const sendMessage = async (text: string) => {
		if (!ticketId) {
			return;
		}

		await TicketAPI.sendMessage(ticketId, text);
	};

	const wsAddNewMessage = (data: WsTicketMessage) => {
		const { ticket_id: wsTicketId } = data;

		if (!ticketId || !messages || ticketId !== wsTicketId) {
			return null;
		}

		const newMessage = data;
		messages = [newMessage, ...messages];
		TicketAPI.wsReadMessagesByTicketId(ticketId);
	};

	onMount(() => {
		$socket?.on('ticket-message', wsAddNewMessage);
	});

	onDestroy(() => {
		$socket?.off('ticket-message', wsAddNewMessage);
	});
</script>

<ChatWindow rawMessages={messages} fetchMessages={getMoreMessages} {sendMessage} />
