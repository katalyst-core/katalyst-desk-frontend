<script lang="ts">
	import { differenceInDays, format } from 'date-fns';
	import { page } from '$app/stores';

	import { Skeleton } from '$ui/skeleton';
	import { orgTarget } from '$utils/index';
	import type { TicketListItem } from '$types/ticket-type';
	import { InfiniteScroll } from '$module/util';
	import { ScrollArea } from '$ui/scroll-area';
	import { Badge } from '$ui/badge';

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
	<ul class="w-80 h-full p-2 space-y-1">
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
					<a
						href={orgTarget(`/ticket/${ticket.ticket_id}`)}
						class="w-full py-2 items-center px-3 flex text-start space-x-2 rounded-lg cursor-pointer transition-colors border border-border {activeTicketId &&
						activeTicketId == ticket.ticket_id
							? 'bg-accent'
							: 'hover:bg-accent'}"
					>
						<div class="w-full h-full flex flex-col justify-center space-y-2">
							<div class="flex items-center justify-between space-x-2">
								<h3 class="text-base font-medium line-clamp-1">
									{ticket.display_name}
								</h3>
								<p class="text-xs text-foreground">
									{getTimeFormat(String(ticket.last_message_timestamp))}
								</p>
							</div>
							<div class="flex justify-between w-full items-center space-x-2">
								<p class="text-sm text-secondary-foreground line-clamp-1">
									{ticket.last_message?.body || ''}
								</p>
								{#if ticket.ticket_status === 'close'}
									<Badge class="bg-red-500/70 text-foreground">Closed</Badge>
								{:else if ticket.is_customer}
									<Badge class="bg-blue-500/70 text-foreground">Open</Badge>
								{:else}
									<Badge class="bg-orange-500/70 text-foreground">Responded</Badge>
								{/if}
							</div>
							{#if ticket.teams.length > 0}
								<div class="flex flex-wrap gap-2">
									{#each ticket.teams as team}
										<Badge>{team.name}</Badge>
									{/each}
								</div>
							{/if}
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
