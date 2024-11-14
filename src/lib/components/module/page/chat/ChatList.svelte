<script lang="ts">
	import { CheckCheck } from 'lucide-svelte';
	import { differenceInDays, format } from 'date-fns';
	import { page } from '$app/stores';

	import * as Avatar from '$ui/avatar';
	import { Skeleton } from '$ui/skeleton';
	import { getTextInitials, orgTarget } from '$utils/index';
	import type { TicketListItem } from '$types/ticket-type';
	import InfiniteScroll from '$module/util/InfiniteScroll.svelte';
	import { ScrollArea } from '$ui/scroll-area';

	interface Props {
		fetchTickets: Function;
		tickets: TicketListItem[] | null;
	}

	let { fetchTickets, tickets }: Props = $props();

	let ticketElement: HTMLDivElement | null = $state(null);

	let activeTicketId: string = $derived($page.params.ticket);

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

<ScrollArea bind:element={ticketElement} orientation="vertical">
	<ul class="w-80 h-full bg-white p-2 space-y-1">
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
				{@const { ticket_id: ticketId } = ticket}
				<li class="w-full">
					<a
						href={orgTarget(`/ticket/${ticketId}`)}
						class="w-full h-[4.5rem] items-center px-3 flex text-start space-x-2 rounded-lg cursor-pointer transition-colors {activeTicketId &&
						activeTicketId == ticket.ticket_id
							? 'bg-gray-300'
							: 'hover:bg-gray-200'}"
					>
						<Avatar.Root class="w-12 h-12">
							<Avatar.Image src="" alt="" />
							<Avatar.Fallback
								class="font-medium text-xl {activeTicketId && activeTicketId == ticket.ticket_id
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
								<p class="text-xs text-gray-400">
									{getTimeFormat(String(ticket.last_message_timestamp))}
								</p>
							</div>
							<div class="flex w-full items-center">
								<div class="flex space-x-1 flex-1">
									{#if !ticket.is_customer}
										{#if ticket.message_status === 'received'}
											<CheckCheck class="w-5 h-5" />
										{:else if ticket.message_status === 'read'}
											<CheckCheck class="w-5 h-5 text-blue-600" />
										{/if}
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
					</a>
				</li>
			{/each}

			{#if ticketElement}
				<InfiniteScroll bind:element={ticketElement} fetch={fetchTickets} direction="down" />
			{/if}
		{/if}
	</ul>
</ScrollArea>
