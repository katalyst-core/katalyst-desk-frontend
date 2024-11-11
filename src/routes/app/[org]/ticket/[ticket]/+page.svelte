<script lang="ts">
	import { page } from '$app/stores';
	import { X } from 'lucide-svelte';

	import * as Dialog from '$ui/dialog';
	import { Skeleton } from '$ui/skeleton';
	import { Button } from '$ui/button';
	import { ChatWindow } from '$module/page/chat';

	import * as TicketAPI from '$api/ticket-api';
	import { goto } from '$app/navigation';
	import { orgTarget } from '$utils/index';
	import { socket } from '$stores/socket-store';
	import type { TicketMessage, WsTicketMessage } from '$types/message-type';
	import type { TicketDetails } from '$types/ticket-type';

	let messages: TicketMessage[] | null = $state(null);
	let ticketDetails: TicketDetails | null = $state(null);
	let currentMessagesPage = $state(1);
	let closeTicketDialogOpen = $state(false);

	let ticketId = $derived($page.params.ticket);

	$effect(() => {
		getMessages();
		getTicketDetails();
	});

	const redirectOut = async () => {
		return await goto(orgTarget('/ticket') || '/app', {
			invalidateAll: true
		});
	};

	const getTicketDetails = async () => {
		if (!ticketId) return redirectOut();

		ticketDetails = null;

		const response = await TicketAPI.getTicketDetails(ticketId);

		if (!response) return redirectOut();

		ticketDetails = response.data;
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

	const closeTicket = async () => {
		const response = await TicketAPI.closeTicket(ticketId);

		if (!response) {
			return;
		}

		closeTicketDialogOpen = false;
		getTicketDetails();
	}

	const wsAddNewMessage = (data: WsTicketMessage) => {
		const { ticket_id: wsTicketId } = data;

		if (!ticketId || !messages || ticketId !== wsTicketId) {
			return null;
		}

		const newMessage = data;
		messages.unshift(newMessage);
		TicketAPI.wsReadMessagesByTicketId(ticketId);
	};

	$effect.pre(() => {
		$socket?.on('ticket-message', wsAddNewMessage);

		return () => {
			$socket?.off('ticket-message', wsAddNewMessage);
		};
	});
</script>

<div class="flex flex-col w-full h-full">
	<div
		class="flex items-center justify-between w-full h-20 px-4 bg-white border-b border-gray-400 border-opacity-35 flex-shrink-0"
	>
		{#if !ticketDetails}
			<Skeleton class="w-32 h-8" />
			<Skeleton class="w-32 h-10" />
		{:else}
			{@const {
				customer_name: customerName,
				ticket_code: ticketCode,
				ticket_status: ticketStatus
			} = ticketDetails}
			<div>
				<h3 class="font-medium">{customerName}</h3>
				<p class="text-gray-400">#{ticketCode}</p>
			</div>

			{#if ticketStatus !== 'close'}
				<Dialog.Root bind:open={closeTicketDialogOpen}>
					<Dialog.Trigger>
						<Button variant="outline" class="hover:text-red-500">
							<span>Close Ticket</span>
							<X class="w-5 h-5" />
						</Button>
					</Dialog.Trigger>
					<Dialog.Content class="max-w-[400px]">
						<Dialog.Header>
							<Dialog.Title>Confirm Closing Ticket</Dialog.Title>
							<Dialog.Description
								>This will close the ticket. The action is irreversible</Dialog.Description
							>
						</Dialog.Header>
						<Dialog.Footer>
							<Dialog.Close>
								<Button variant="secondary">Cancel</Button>
							</Dialog.Close>
							<Button variant="destructive" click={closeTicket}>Close Ticket</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			{:else}
				<Button variant="outline" class="text-red-500 !opacity-100" disabled>
					<span>Closed</span>
					<X class="w-5 h-5" />
				</Button>
			{/if}
		{/if}
	</div>
	<div class="w-full h-0 flex-grow">
		<ChatWindow
			rawMessages={messages}
			fetchMessages={getMoreMessages}
			disabled={ticketDetails?.ticket_status === 'close'}
			{sendMessage}
		/>
	</div>
</div>
