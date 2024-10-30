<script lang="ts">
	import { CheckCheck } from 'lucide-svelte';
	import { differenceInDays, format } from 'date-fns';

	import * as Avatar from '$ui/avatar';
	import { Skeleton } from '$ui/skeleton';
	import { getTextInitials } from '$utils/index';
	import type { TicketListItem } from '$types/ticket-type';
	import InfiniteScroll from '$module/util/InfiniteScroll.svelte';

	let ticketElement: HTMLElement;
	export let fetchTickets: Function;
	export let activeTicket: TicketListItem | null;
	export let tickets: TicketListItem[] | null;

	const setActiveTicket = (ticket: TicketListItem) => {
		activeTicket = ticket;
	};

	const formatCount = (count: number) => {
		if (count > 99) {
			return '99+';
		}

		return count;
	};

	const getTimeFormat = (timestamp: string) => {
		const time = new Date(timestamp);
		const now = new Date(Date.now());

		if (differenceInDays(now, time) >= 2) {
			return format(time, 'MM/dd/yyyy');
		}

		if (time.getDate() != now.getDate()) {
			return 'Yesterday';
		}

		return format(time, 'HH:mm');
	};
</script>

<ul
	class="w-80 h-full bg-white border-r border-gray-400 border-opacity-35 p-2 space-y-1 overflow-scroll"
	bind:this={ticketElement}
>
	{#if tickets == null}
		{#each [3, 4, 2] as _}
			<li class="w-full">
				<div class="w-full h-[4.5rem] items-center px-3 flex text-start space-x-2 rounded-lg">
					<Skeleton class="h-12 w-12 rounded-full" />
					<div class="space-y-2">
						<Skeleton class="h-4 w-[100px]" />
						<Skeleton class="h-4 w-[150px]" />
					</div>
				</div>
			</li>
		{/each}
	{:else}
		{#each tickets as ticket}
			<li class="w-full">
				<button
					on:click={() => setActiveTicket(ticket)}
					class="w-full h-[4.5rem] items-center px-3 flex text-start space-x-2 rounded-lg cursor-pointer transition-colors {activeTicket &&
					activeTicket.ticket_id == ticket.ticket_id
						? 'bg-gray-300'
						: 'hover:bg-gray-200'}"
				>
					<Avatar.Root class="w-12 h-12">
						<Avatar.Image src="" alt="" />
						<Avatar.Fallback
							class="font-medium text-xl {activeTicket && activeTicket.ticket_id == ticket.ticket_id
								? 'bg-gray-200'
								: 'bg-gray-300'}">{getTextInitials(ticket.display_name)}</Avatar.Fallback
						>
					</Avatar.Root>
					<div class="w-full">
						<div class="flex items-center justify-between">
							<h3
								class="w-36 text-base font-medium whitespace-nowrap text-ellipsis overflow-hidden"
							>
								{ticket.display_name}
							</h3>
							<p class="text-xs text-gray-400">{getTimeFormat(ticket.last_message_timestamp)}</p>
						</div>
						<div class="flex w-full items-center">
							<div class="flex space-x-1 flex-1">
								{#if !ticket.is_customer}
									<CheckCheck class="w-5 h-5 {ticket.is_read ? 'text-blue-600' : ''}" />
								{/if}
								<p
									class="w-36 text-sm text-gray-500 whitespace-nowrap text-ellipsis overflow-hidden"
								>
									{ticket.last_message?.body || ''}
								</p>
							</div>
							{#if ticket.unread_count > 0}
								<div class="flex h-5 px-2 justify-center items-center rounded-full bg-blue-500">
									<p class="text-xs text-white font-medium">{formatCount(ticket.unread_count)}</p>
								</div>
							{/if}
						</div>
					</div>
				</button>
			</li>
		{/each}

		{#if ticketElement}
			<InfiniteScroll bind:element={ticketElement} fetch={fetchTickets} direction="down" />
		{/if}
	{/if}
</ul>
