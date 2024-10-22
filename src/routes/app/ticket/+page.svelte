<script lang="ts">
	import { onMount } from 'svelte';

	import * as OrganizationAPI from '$api/organization-api';
	import * as TicketAPI from '$api/ticket-api';
	import { selectedOrganization } from '$stores/organization-store';
	import type { TicketListItem } from '$types/ticket-type';
	import type { TicketMessage } from '$types/message-type';

	import ChatList from '$module/page/chat/ChatList.svelte';
	import ChatWindow from '$module/page/chat/ChatWindow.svelte';

	let tickets: TicketListItem[] | null = null;
	let messages: TicketMessage[] | null = null;
	let activeTicket: TicketListItem | null;
	let currentMessagesPage = 1;

	$: activeTicket = null;
	$: activeTicket ? getMessages() : null;

	const setTickets = async (orgId: string) => {
		const _tickets = await OrganizationAPI.getTickets(orgId);
		if (_tickets?.ok) {
			tickets = _tickets.data;
		}
	}

	const getMessages = async () => {
		if (!activeTicket) {
			return;
		}

		activeTicket.unread_count = 0;
		currentMessagesPage = 1;

		const ticketId = activeTicket.ticket_id;
		const _messages = await TicketAPI.getMessagesByTicketId(ticketId, 1);
		if (_messages?.ok) {
			messages = _messages.data.result.reverse();

			await TicketAPI.readMessagesByTicketId(ticketId);
		}
	}

	const getMoreMessages = async () => {
		if (!activeTicket) {
			return;
		}

		const ticketId = activeTicket.ticket_id;
		const _messages = await TicketAPI.getMessagesByTicketId(ticketId, ++currentMessagesPage);
		if (messages && _messages?.ok) {
			const { total_page: totalPage } = _messages.data.pagination;
			if (currentMessagesPage > totalPage) {
				return;
			}

			messages = [..._messages.data.result.reverse(), ...messages];
			currentMessagesPage = Math.min(currentMessagesPage, _messages.data.pagination.total_page);
		}
	};

	onMount(async () => {
		selectedOrganization.subscribe(async (orgId) => {
			activeTicket = null;
			tickets = null;
			messages = null;

			if (!orgId) {
				return;
			}

			await setTickets(orgId);
		});
	});
</script>

<div class="w-full h-full flex">
	<div class="h-full bg-white flex flex-col">
		<div class="h-20 flex items-center px-4 border-b border-gray-400 border-opacity-35">
			<h1 class="text-3xl font-semibold">Tickets</h1>
		</div>
		<ChatList {tickets} bind:activeTicket />
	</div>
	{#if messages}
		<ChatWindow messages={messages} fetchMessages={getMoreMessages} />
	{/if}
</div>
