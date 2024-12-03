<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Clock, X } from 'lucide-svelte';
	import { differenceInMinutes } from 'date-fns';

	import * as Dialog from '$ui/dialog';
	import { Skeleton } from '$ui/skeleton';
	import { Button } from '$ui/button';
	import { ChatWindow } from '$module/page/chat';

	import { TicketAPI } from '$api/.';
	import { goto } from '$app/navigation';
	import { orgTarget } from '$utils/index';
	import { socket } from '$stores/socket-store';
	import type { TicketMessage, WsTicketMessage } from '$types/message-type';
	import type { TicketDetails, WsTicketUpdate } from '$types/ticket-type';
	import TicketTeams from './ticket-teams.svelte';

	let messages: TicketMessage[] | null = $state(null);
	let ticketDetails: TicketDetails | null = $state(null);
	let currentMessagesPage = $state(1);
	let closeTicketDialogOpen = $state(false);
	let remainingTime: string | null = $state(null);
	let remainingTimeInterval: NodeJS.Timeout | undefined = $state();

	let orgId = $derived($page.params.org);
	let ticketId = $derived($page.params.ticket);

	$effect(() => {
		getMessages();
		getTicketDetails();
	});

	$effect(() => {
		const expiration = ticketDetails?.expiration;
		if (!expiration) {
			remainingTime = null;
			clearTimeout(remainingTimeInterval);
			return;
		}

		console.log(remainingTimeInterval);

		if (remainingTimeInterval) {
			updateRemainingTime();
			return;
		}

		remainingTimeInterval = setInterval(updateRemainingTime, 1000);
	});

	const updateRemainingTime = () => {
		const now = new Date(Date.now());
		const expiration = new Date(ticketDetails?.expiration || 0);
		const minutes = differenceInMinutes(expiration, now);

		if (minutes <= 0) {
			remainingTime = '00:00';
			clearInterval(remainingTimeInterval);
			return;
		}

		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;
		remainingTime = `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
	};

	const redirectOut = async () => {
		return await goto(orgTarget('/ticket') || '/app', {
			invalidateAll: true
		});
	};

	const getTicketDetails = async () => {
		if (!ticketId) return redirectOut();

		ticketDetails = null;

		const response = await TicketAPI.getTicketDetails(ticketId);

		if (!response.ok) return redirectOut();

		ticketDetails = response.data;
	};

	const getMessages = async () => {
		if (!ticketId) {
			return redirectOut();
		}

		currentMessagesPage = 1;
		messages = null;

		const response = await TicketAPI.getMessages(ticketId, 1);

		if (!response.ok) return redirectOut();

		messages = response.data.result;
	};

	const getMoreMessages = async () => {
		if (!ticketId || !messages) return redirectOut();
		if (currentMessagesPage === -1) return;

		const response = await TicketAPI.getMessages(ticketId, ++currentMessagesPage);
		if (!response.ok) return redirectOut();

		const {
			result: newMessages,
			pagination: { total_page: totalPage }
		} = response.data;

		if (currentMessagesPage > totalPage) {
			currentMessagesPage = -1;
			return;
		}

		messages?.push(...newMessages);
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
	};

	const wsAddNewMessage = (data: WsTicketMessage) => {
		const { ticket_id: wsTicketId } = data;

		if (!ticketId || !messages || ticketId !== wsTicketId) {
			return null;
		}

		const newMessage = data;
		messages.unshift(newMessage);
	};

	const wsTicketWindowUpdate = (data: WsTicketUpdate) => {
		const { ticket_id, message_id, message_status, expiration } = data;

		if (!ticketId || !messages || !ticketDetails || ticketId !== ticket_id) return;

		if (expiration) {
			ticketDetails.expiration = expiration;
		}

		if (message_id && message_status) {
			const message = messages.find((m) => m.message_id === message_id);
			if (!message) return;

			message.message_status = message_status;
		}
	};

	$effect.pre(() => {
		$socket?.on('ticket-message', wsAddNewMessage);
		$socket?.on('ticket-update', wsTicketWindowUpdate);

		return () => {
			$socket?.off('ticket-message', wsAddNewMessage);
			$socket?.off('ticket-update', wsTicketWindowUpdate);
		};
	});

	onMount(() => {
		return () => {
			clearInterval(remainingTimeInterval);
		};
	});
</script>

<div class="flex flex-col w-full h-full">
	<div
		class="flex items-center justify-between w-full h-20 px-4 bg-background border-b border-border border-opacity-35 flex-shrink-0"
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
			<div class="">
				<div class="flex space-x-2 items-center">
					<h3 class="font-medium">{customerName}</h3>
					<p class="text-gray-400">#{ticketCode}</p>
				</div>
				{#if remainingTime}
					<div class="flex items-center space-x-2">
						<Clock class="w-4 h-4" />
						<span>{remainingTime}</span>
					</div>
				{/if}
			</div>

			<div>
				<TicketTeams ticketId={ticketId} orgId={orgId} teams={ticketDetails.teams} />

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
			</div>
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
