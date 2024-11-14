<script lang="ts">
	import { onMount } from 'svelte';
	import { format } from 'date-fns';
	import { SendHorizontal, CheckCheck, X, Check } from 'lucide-svelte';

	import { InfiniteScroll } from '$module/util';
	import { Skeleton } from '$ui/skeleton';
	import { Input } from '$ui/input';
	import { ScrollArea } from '$ui/scroll-area';

	import { scrollToBottom } from '$utils/index';
	import type { TicketMessage } from '$types/message-type';

	interface Props {
		rawMessages: TicketMessage[] | null;
		fetchMessages: () => void;
		sendMessage: (text: string) => void;
		disabled?: boolean;
	}

	let { rawMessages = null, fetchMessages, sendMessage, disabled }: Props = $props();

	let autoScrollThreshold = 200;
	let messageElement: HTMLDivElement | null = $state(null);
	let isMessageSending: boolean = $state(false);
	let messageText: string = $state('');
	let hasNewMessages: boolean = $state(true);

	let messages = $derived(rawMessages?.toReversed());
	let disableMessageArea = $derived(isMessageSending || !messages || disabled);

	$effect(() => {
		if (!rawMessages) {
			hasNewMessages = true;
			return;
		}

		if (!messageElement || !hasNewMessages) return;

		scrollToBottom(messageElement);
		hasNewMessages = false;
	});

	$effect(() => {
		if (!rawMessages) return;

		rawMessages.length;

		scrollOnNewMessage();
	});

	const scrollOnNewMessage = () => {
		if (!messageElement) return;

		const { scrollTop, scrollHeight, clientHeight } = messageElement;

		if (scrollTop + clientHeight <= scrollHeight - autoScrollThreshold) return;

		scrollToBottom(messageElement);
	};

	const showMessageDate = (idx: number) => {
		if (messages == null) {
			return;
		}

		const prevIdx = idx - 1;
		const currTime = new Date(messages[idx].timestamp);
		const prevTime = new Date(messages[prevIdx]?.timestamp);
		const now = new Date(Date.now());

		if (prevTime.getDate() != currTime.getDate() && currTime.getDate() == now.getDate()) {
			return 'Today';
		}

		if (prevIdx < 0 || prevTime.getDate() != currTime.getDate()) {
			if (Math.abs(currTime.getDate() - now.getDate()) > 1) {
				return format(currTime, 'MM/dd/yyyy');
			}
			return 'Yesterday';
		}

		return null;
	};

	const getTimeFormat = (timestamp: Date) => {
		const time = new Date(timestamp);
		return format(time, 'HH:mm');
	};

	const sendMessageFunction = async () => {
		isMessageSending = true;

		await sendMessage(messageText);
		messageText = '';

		isMessageSending = false;
	};

	const getRandomNumber = (n: number) => Math.floor(Math.random() * n) + 1;
</script>

<div class="w-full h-full flex flex-col justify-between">
	<!-- Chat messages -->
	<div class="flex-grow"></div>
	<ScrollArea bind:element={messageElement} orientation="vertical">
		<ul class="w-full flex-grow justify-end px-2 py-2 space-y-2">
			{#if messageElement && messages}
				<InfiniteScroll bind:element={messageElement} fetch={fetchMessages} direction="up" />
			{/if}

			{#if !messages}
				{#each { length: 15 } as _}
					{@const isCustomer = getRandomNumber(10) < 5}
					{@const length = getRandomNumber(6) + 4}

					{#snippet skeleton(size: number)}
						<Skeleton style="width: {size * 50}px; height: 40px" />
					{/snippet}

					{#if isCustomer}
						<li class="w-full flex justify-end pl-10">
							{@render skeleton(length)}
						</li>
					{:else}
						<li class="w-full flex justify-start pr-10">
							{@render skeleton(length)}
						</li>
					{/if}
				{/each}
			{:else}
				{#each messages as message, index}
					{@const {
						is_customer: isCustomer,
						message_status: messageStatus,
						timestamp,
						content: { body: text }
					} = message}

					{#if showMessageDate(index)}
						<li class="w-full flex justify-center">
							<div class="flex py-2">
								<p class="text-xs">{showMessageDate(index)}</p>
							</div>
						</li>
					{/if}

					{#if !isCustomer}
						<li class="w-full flex justify-end pl-10">
							<div
								class="flex items-end w-fit bg-gray-950 px-3 py-2 rounded-2xl rounded-br space-x-2"
							>
								<p class="text-white text-base">{text}</p>
								<div class="flex items-center space-x-1">
									<p class="text-[10px] text-gray-300">{getTimeFormat(timestamp)}</p>
									{#if messageStatus === 'sent'}
										<Check class="w-4 h-4 text-gray-400" />
									{:else if messageStatus === 'received'}
										<CheckCheck class="w-4 h-4 text-gray-400" />
									{:else if messageStatus === 'read'}
										<CheckCheck class="w-4 h-4 text-blue-500" />
									{/if}
								</div>
							</div>
						</li>
					{:else}
						<li class="w-full flex justify-start pr-10">
							<div
								class="flex items-end w-fit bg-gray-200 px-3 py-2 rounded-2xl rounded-bl space-x-2"
							>
								<p class="text-black text-base">{text}</p>
								<div class="flex items-center space-x-1">
									<p class="text-[10px] text-gray-800">{getTimeFormat(timestamp)}</p>
								</div>
							</div>
						</li>
					{/if}
				{/each}
			{/if}
		</ul>
	</ScrollArea>

	<!-- Chat input -->
	<div class="w-full">
		<form
			onsubmit={sendMessageFunction}
			class="h-16 w-full flex items-center px-4 bg-background space-x-2 border-t border-border border-opacity-35"
		>
			<Input
				bind:value={messageText}
				class="bg-secondary rounded-full"
				placeholder="Say something"
				disabled={disableMessageArea}
			/>
			<button
				class="p-3 flex justify-center items-center bg-blue-500 rounded-full transition-all {disableMessageArea
					? 'brightness-75'
					: 'hover:brightness-90'}"
			>
				<SendHorizontal class="w-4 h-4 text-white" />
			</button>
		</form>
	</div>
</div>
