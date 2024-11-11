<script lang="ts">
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import { page } from '$app/stores';

	import * as OrganizationAPI from '$api/organization-api';
	import { ChatList } from '$module/page/chat';

	import type { TicketListItem, WsNewTicket } from '$types/ticket-type';
	import type { WsTicketMessage } from '$types/message-type';
	import { socket } from '$stores/socket-store';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let activeOrgId: string | null = $page.params.org;
	let tickets: TicketListItem[] | null = $state(null);
	let currentTicketsPage = $state(1);

	let activeTicketId: string = $derived($page.params.ticket);

	$effect(() => {
		setReadMessage();
	});

	const setReadMessage = () => {
		if (!activeTicketId || !tickets) {
			return;
		}

		const ticket = tickets.find((t) => t.ticket_id === activeTicketId);
		if (!ticket) return;

		ticket.unread_count = 0;
	};

	const getTickets = async () => {
		const _tickets = await OrganizationAPI.getTicketsByOrgId(activeOrgId, 1);
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

	const wsUpdateTicketData = (data: WsTicketMessage) => {
		if (!tickets) {
			return null;
		}

		const { ticket_id: ticketId } = data;
		const ticket = tickets.find((t) => t.ticket_id === ticketId);

		if (!ticket) {
			return null;
		}

		const { content, timestamp, is_customer, message_status } = data;

		ticket.last_message = content;
		ticket.is_customer = is_customer;
		ticket.message_status = message_status;
		ticket.last_message_timestamp = timestamp;

		// Update active chat window
		if (!activeTicketId || activeTicketId != data.ticket_id) {
			ticket.unread_count = Number(ticket.unread_count) + 1;
			return;
		}
	};

	const wsAddNewTicket = (data: WsNewTicket) => {
		if (!tickets) {
			return null;
		}

		const { ticket_id } = data;
		const ticketIdx = tickets.findIndex((t) => t.ticket_id === ticket_id);

		if (ticketIdx !== -1) {
			tickets.splice(ticketIdx, 1);
		}

		tickets.unshift(data);
	};

	onMount(async () => {
		await getTickets();
	});

	$effect.pre(() => {
		$socket?.on('ticket-message', wsUpdateTicketData);
		$socket?.on('new-ticket', wsAddNewTicket);

		return () => {
			$socket?.off('ticket-message', wsUpdateTicketData);
			$socket?.off('new-ticket', wsAddNewTicket);
		};
	});
</script>

<div class="w-full h-full flex">
	<div class="h-full bg-white flex flex-col border-r border-gray-400 border-opacity-35">
		<div class="h-20 flex items-center px-4 border-b border-gray-400 border-opacity-35">
			<h1 class="text-3xl font-semibold">Tickets</h1>
		</div>
		<ChatList {tickets} fetchTickets={getMoreTickets} />
	</div>
	{@render children()}
</div>
