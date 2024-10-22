<script lang="ts">
	import type { TicketMessage } from '$types/message-type';
	import { format } from 'date-fns';

	import { Input } from '$ui/input';
	import { SendHorizontal, CheckCheck } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { scrollToBottom } from '$utils/index';
	import InfiniteScroll from '$module/util/InfiniteScroll.svelte';

	let messageElement: HTMLElement;
	export let fetchMessages: Function;
	export let messages: TicketMessage[];

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

	const getTimeFormat = (timestamp: string) => {
		const time = new Date(timestamp);
		return format(time, 'HH:mm');
	};

	onMount(() => {
		if (messageElement) {
			scrollToBottom(messageElement);
		}
	});
</script>

<div class="w-full h-full flex flex-col justify-between">
	<!-- Chat messages -->
	<ul bind:this={messageElement} class="w-full h-full px-2 py-2 space-y-2 overflow-y-scroll">
		{#if messageElement}
			<InfiniteScroll bind:element={messageElement} fetch={fetchMessages} direction="up" />
		{/if}

		{#each messages as message, index}
			{#if showMessageDate(index)}
				<li class="w-full flex justify-center">
					<div class="flex py-2">
						<p class="text-xs">{showMessageDate(index)}</p>
					</div>
				</li>
			{/if}

			{#if !message.is_customer}
				<li class="w-full flex justify-end pl-10">
					<div class="flex items-end w-fit bg-gray-950 px-3 py-2 rounded-2xl rounded-br space-x-2">
						<p class="text-white text-base">{message.content?.text?.body}</p>
						<div class="flex items-center space-x-1">
							<p class="text-[10px] text-gray-300">{getTimeFormat(message.timestamp)}</p>
							<CheckCheck class="w-4 h-4 text-gray-400 {message.is_read ? 'text-blue-500' : ''}" />
						</div>
					</div>
				</li>
			{:else}
				<li class="w-full flex justify-start pr-10">
					<div class="flex items-end w-fit bg-gray-200 px-3 py-2 rounded-2xl rounded-bl space-x-2">
						<p class="text-black text-base">{message.content?.text?.body}</p>
						<div class="flex items-center space-x-1">
							<p class="text-[10px] text-gray-800">{getTimeFormat(message.timestamp)}</p>
						</div>
					</div>
				</li>
			{/if}
		{/each}
	</ul>

	<!-- Chat input -->
	<div
		class="h-16 w-full flex items-center px-4 bg-white space-x-2 border-t border-gray-400 border-opacity-35"
	>
		<Input class="bg-gray-100 rounded-full" placeholder="Say something" />
		<button
			class="p-3 flex justify-center items-center bg-blue-500 rounded-full hover:brightness-90 transition-all"
		>
			<SendHorizontal class="w-4 h-4 text-white" />
		</button>
	</div>
</div>
