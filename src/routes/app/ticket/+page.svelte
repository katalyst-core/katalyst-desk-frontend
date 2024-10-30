<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import * as OrganizationAPI from '$api/organization-api';
	import * as TicketAPI from '$api/ticket-api';
	import { selectedOrganization } from '$stores/organization-store';
	import type { TicketListItem } from '$types/ticket-type';
	import type { MessageObject, TicketMessage, WsTicketMessage } from '$types/message-type';

	import ChatList from '$module/page/chat/ChatList.svelte';
	import ChatWindow from '$module/page/chat/ChatWindow.svelte';
	import LoadingPage from '$module/page/LoadingPage.svelte';
	import { socket } from '$stores/socket-store';

	let tickets: TicketListItem[] | null = $state(null);
	let messages: TicketMessage[] | null = $state(null);
	let activeTicket: TicketListItem | null = $state(null);
	let activeOrgId: string | null = $state(null);
	let currentMessagesPage = $state(1);
	let currentTicketsPage = $state(1);
	let isMessagesLoading = $state(false);

	$effect(() => {
		getMessages();
	});

	const getTickets = async (orgId: string) => {
		const _tickets = await OrganizationAPI.getTicketsByOrgId(orgId, 1);
		if (_tickets?.ok) {
			tickets = _tickets.data.result;
		}
	};

	const getMoreTickets = async () => {
		if (!activeOrgId) {
			return;
		}

		const _tickets = await OrganizationAPI.getTicketsByOrgId(activeOrgId, ++currentTicketsPage);
		if (tickets && _tickets?.ok) {
			const {
				result: newTickets,
				pagination: { total_page: totalPage }
			} = _tickets.data;
			if (currentTicketsPage > totalPage) {
				return;
			}

			tickets.push(...newTickets);
			currentTicketsPage = Math.min(currentTicketsPage, totalPage);
		}
	};

	const getMessages = async () => {
		if (!activeTicket) {
			return;
		}

		activeTicket.unread_count = 0;
		currentMessagesPage = 1;
		isMessagesLoading = true;

		const ticketId = activeTicket.ticket_id;
		const _messages = await TicketAPI.getMessagesByTicketId(ticketId, 1);
		if (_messages?.ok) {
			messages = _messages.data.result;

			isMessagesLoading = false;

			TicketAPI.wsReadMessagesByTicketId(ticketId);
		}
	};

	const getMoreMessages = async () => {
		if (!activeTicket) {
			return;
		}

		const ticketId = activeTicket.ticket_id;
		const _messages = await TicketAPI.getMessagesByTicketId(ticketId, ++currentMessagesPage);
		if (messages && _messages?.ok) {
			const {
				result: newMessages,
				pagination: { total_page: totalPage }
			} = _messages.data;
			if (currentMessagesPage > totalPage) {
				return;
			}

			messages.push(...newMessages);
			currentMessagesPage = Math.min(currentMessagesPage, totalPage);
		}
	};

	const onOrganizationChange = () => {
		selectedOrganization.subscribe(async (orgId) => {
			activeOrgId = null;
			activeTicket = null;
			tickets = null;
			messages = null;

			if (!orgId) {
				return;
			}

			activeOrgId = orgId;

			await getTickets(orgId);
		});
	};

	const onSocketTicketMessage = (data: WsTicketMessage) => {
		if (!(data satisfies WsTicketMessage)) {
			return null;
		}

		if (!tickets) {
			return null;
		}

		const ticket = tickets.find((t) => t.ticket_id === data.ticket_id);

		if (!ticket) {
			return null;
		}

		const { ticket_id, content, timestamp, is_customer, is_read } = data;

		ticket.last_message = content;
		ticket.is_customer = is_customer;
		ticket.is_read = is_read;
		ticket.last_message_timestamp = timestamp;

		// Update active chat window
		if (!activeTicket || activeTicket.ticket_id != data.ticket_id) {
			ticket.unread_count = Number(ticket.unread_count) + 1;
			return;
		}

		if (!messages) {
			return;
		}

		const newMessage = data;
		messages = [newMessage, ...messages];
		TicketAPI.wsReadMessagesByTicketId(ticket_id);
	};

	onMount(async () => {
		onOrganizationChange();

		$socket?.on('ticket-message', onSocketTicketMessage);
	});

	onDestroy(async () => {
		$socket?.off('ticket-message', onSocketTicketMessage);
	});
</script>

<div class="w-full h-full flex">
	<div class="h-full bg-white flex flex-col">
		<div class="h-20 flex items-center px-4 border-b border-gray-400 border-opacity-35">
			<h1 class="text-3xl font-semibold">Tickets</h1>
		</div>
		<ChatList bind:activeTicket {tickets} fetchTickets={getMoreTickets} />
	</div>
	<LoadingPage loading={isMessagesLoading}>
		{#if messages}
			<ChatWindow rawMessages={messages} fetchMessages={getMoreMessages} />
		{/if}
	</LoadingPage>
</div>
