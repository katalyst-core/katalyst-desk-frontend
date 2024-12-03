<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { page } from '$app/stores';

	import { OrganizationAPI } from '$api/.';
	import { ChatList } from '$module/page/chat';
	import TeamFilter from './team-filter.svelte';

	import type { TicketListItem, WsNewTicket, WsTicketUpdate } from '$types/ticket-type';
	import type { WsTicketMessage } from '$types/message-type';
	import { socket } from '$stores/socket-store';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let activeOrgId: string | null = $page.params.org;
	let tickets: TicketListItem[] | null = $state(null);
	let currentTicketsPage = $state(1);
	let selectedTeams: string[] = $state([]);

	let activeTicketId: string = $derived($page.params.ticket);

	$effect(() => {
		setReadMessage();
	});

	$effect(() => {
		getTickets();
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
		const response = await OrganizationAPI.getTickets(activeOrgId, 1, 10, selectedTeams);
		if (!response.ok) return;

		tickets = response.data.result;
	};

	const getMoreTickets = async () => {
		if (!activeOrgId) {
			return;
		}

		const response = await OrganizationAPI.getTickets(activeOrgId, ++currentTicketsPage, 10, selectedTeams);

		if (!response.ok) return;

		const {
			result: newTickets,
			pagination: { total_page: totalPage }
		} = response.data;
		if (currentTicketsPage > totalPage) {
			return;
		}

		tickets?.push(...newTickets);
		currentTicketsPage = Math.min(currentTicketsPage, totalPage);
	};

	const wsUpdateTicketMessage = (data: WsTicketMessage) => {
		if (!tickets) return;

		const { ticket_id: ticketId } = data;
		const ticketIdx = tickets.findIndex((t) => t.ticket_id === ticketId);
		const ticket = tickets[ticketIdx];

		if (!ticket) return;

		const { content, timestamp, is_customer, message_status } = data;

		ticket.last_message = content;
		ticket.is_customer = is_customer;
		ticket.message_status = message_status;
		ticket.last_message_timestamp = timestamp;

		// Update active chat window
		if (!activeTicketId || activeTicketId != data.ticket_id) {
			ticket.unread_count = Number(ticket.unread_count) + 1;
		}

		tickets.splice(ticketIdx, 1);
		tickets.unshift(ticket);
	};

	const wsAddNewTicket = (data: WsNewTicket) => {
		if (!tickets) return;

		const ticketIdx = tickets.findIndex((t) => t.channel_customer_id === data.channel_customer_id);

		if (ticketIdx !== -1) {
			tickets.splice(ticketIdx, 1);
		}

		tickets.unshift({
			...data,
			ticket_status: 'open'
		});
	};

	const wsTicketListUpdate = (data: WsTicketUpdate) => {
		const { ticket_id, ticket_status } = data;

		if (tickets && ticket_id && ticket_status) {
			const ticket = tickets.find((t) => t.ticket_id === ticket_id);

			if (ticket) {
				ticket.ticket_status = ticket_status;
			}
		}
	};

	const wsTicketListRefresh = () => {
		getTickets();
	};

	$effect.pre(() => {
		$socket?.on('ticket-message', wsUpdateTicketMessage);
		$socket?.on('new-ticket', wsAddNewTicket);
		$socket?.on('ticket-update', wsTicketListUpdate);
		$socket?.on('ticket-refresh', wsTicketListRefresh);

		return () => {
			$socket?.off('ticket-message', wsUpdateTicketMessage);
			$socket?.off('new-ticket', wsAddNewTicket);
			$socket?.off('ticket-update', wsTicketListUpdate);
			$socket?.off('ticket-refresh', wsTicketListRefresh);
		};
	});
</script>

<div class="w-full h-full flex">
	<div class="h-full bg-background flex flex-col border-r border-border border-opacity-35">
		<div class="flex flex-col justify-center items-start space-y-2 px-4 py-4 border-b border-border border-opacity-35">
			<h1 class="text-3xl font-semibold">Tickets</h1>
			<TeamFilter bind:selectedTeams={selectedTeams} />
		</div>
		<ChatList {tickets} fetchTickets={getMoreTickets} />
	</div>
	{@render children()}
</div>
