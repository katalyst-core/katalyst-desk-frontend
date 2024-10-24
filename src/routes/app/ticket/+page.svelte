<script lang="ts">
	import { onMount } from 'svelte';

	import * as OrganizationAPI from '$api/organization-api';
	import * as TicketAPI from '$api/ticket-api';
	import { selectedOrganization } from '$stores/organization-store';
	import type { TicketListItem } from '$types/ticket-type';
	import type { TicketMessage } from '$types/message-type';

	import ChatList from '$module/page/chat/ChatList.svelte';
	import ChatWindow from '$module/page/chat/ChatWindow.svelte';
	import LoadingPage from '$module/page/LoadingPage.svelte';

	let tickets: TicketListItem[] | null = null;
	let messages: TicketMessage[] | null = null;
	let activeTicket: TicketListItem | null;
	let activeOrgId: string | null;
	let currentMessagesPage = 1;
	let currentTicketsPage = 1;
	let isMessagesLoading = false;

	$: activeTicket = null;
	$: activeTicket ? getMessages() : null;

	const getTickets = async (orgId: string) => {
		const _tickets = await OrganizationAPI.getTicketsByOrgId(orgId, 1);
		if (_tickets?.ok) {
			tickets = _tickets.data.result;
		}
	};

	const getMoreTickets = async (org: string) => {
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

			tickets = [...tickets, ...newTickets];
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
			messages = _messages.data.result.reverse();

			isMessagesLoading = false;

			await TicketAPI.readMessagesByTicketId(ticketId);
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

			messages = [...newMessages.reverse(), ...messages];
			currentMessagesPage = Math.min(currentMessagesPage, totalPage);
		}
	};

	onMount(async () => {
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
			<ChatWindow {messages} fetchMessages={getMoreMessages} />
		{/if}
	</LoadingPage>
</div>
