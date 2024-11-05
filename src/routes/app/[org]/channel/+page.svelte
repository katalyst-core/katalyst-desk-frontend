<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import { Plus } from 'lucide-svelte';
	import { Tabs } from 'bits-ui';

	import * as Dialog from '$ui/dialog';
	import * as SideMenu from '$module/navigation/side-menu';
	import Skeleton from '$ui/skeleton/skeleton.svelte';
	import { LoadingPage } from '$module/page';
	import { Separator } from '$ui/separator';
	import InstagramIcon from '$lib/images/icons/instagram.svg';
	import WhatsAppIcon from '$lib/images/icons/whatsapp.svg';
	import InstagramOutlineIcon from '$lib/images/icons/instagram-outline.svg';
	import WhatsAppOutlineIcon from '$lib/images/icons/whatsapp-outline.svg';

	import { PUBLIC_INSTAGRAM_AUTH_URL } from '$env/static/public';
	import { Button } from '$ui/button';
	import { ChannelAPI } from '$api/index';
	import type { ChannelAccount } from '$types/channel-type';

	let orgId = $page.params.org;
	let accounts: ChannelAccount[] | null = $state(null);
	let disconnectDialogOpen: boolean = $state(false);

	const ChannelIcons: Record<string, string> = {
		instagram: InstagramIcon,
		whatsapp: WhatsAppIcon
	};

	const ChannelConnections = [
		{
			label: 'Login with Instagram',
			icon: InstagramOutlineIcon,
			color:
				'bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]',
			href: `${PUBLIC_INSTAGRAM_AUTH_URL}&state=${orgId}`
		},
		{
			label: 'WhatsApp',
			icon: WhatsAppOutlineIcon,
			color: 'bg-[#25D366]',
			disabled: true
		}
	];

	const deleteAccount = async (channelAccountId: string) => {
		const response = await ChannelAPI.deleteChannelAccount(channelAccountId);

		if (!response) {
			return;
		}

		disconnectDialogOpen = false;
		getChannelAccounts();
	};

	const getChannelAccounts = async () => {
		if (!orgId) {
			return;
		}

		accounts = null;
		const response = await ChannelAPI.getChannelAccounts(orgId);

		if (!response?.ok) {
			return;
		}

		accounts = response.data;
	};

	onMount(async () => {
		await getChannelAccounts();
	});
</script>

<div class="flex w-full h-full justify-center px-4 py-8">
	<div class="flex w-full max-w-[960px] h-full py-4 bg-white border rounded-md shadow-md">
		<Tabs.Root value="outbound" class="flex w-full h-full px-4">
			<SideMenu.List class="w-60">
				{#if accounts == null}
					{#each { length: 4 } as _}
						<Skeleton class="h-9 w-full rounded-md" />
					{/each}
				{:else}
					{#each accounts as account}
						{@const {
							channel_account_id: channelAccountId,
							channel_type: channelType,
							channel_account_name: channelAccountName
						} = account}
						{@const instagramAt = channelType == 'instagram' ? '@' : ''}
						<SideMenu.Trigger value={channelAccountId} title="{instagramAt}{channelAccountName}">
							{#snippet icon()}
								<img src={ChannelIcons[channelType]} alt="" class="w-8 h-8" />
							{/snippet}
						</SideMenu.Trigger>
					{/each}
				{/if}

				<Dialog.Root>
					<Dialog.Trigger
						class="flex space-x-2 justify-center items-center h-10 rounded-md hover:bg-gray-200 transition-colors"
					>
						<Plus class="w-4 h-4" /><span>Add channel</span>
					</Dialog.Trigger>
					<Dialog.Content class="max-w-[40rem]">
						<Dialog.Header>
							<Dialog.Title>Add Connections</Dialog.Title>
						</Dialog.Header>
						<div class="grid grid-cols-2 gap-2">
							{#each ChannelConnections as connection}
								<a
									href={connection.href || '#'}
									class={cn(
										`flex items-center px-4 py-2 space-x-6 text-base font-semibold text-white rounded-full ${connection.disabled ? 'brightness-90 cursor-not-allowed' : 'hover:brightness-90'} transition-all`,
										connection.color
									)}
								>
									<img src={connection.icon} alt="" class="w-8 h-8" />
									<span>{connection.label}</span>
								</a>
							{/each}
						</div>
					</Dialog.Content>
				</Dialog.Root>
			</SideMenu.List>

			<Separator orientation="vertical" class="mx-4" />

			{#if accounts == null}
				<LoadingPage />
			{:else}
				{#each accounts as account}
					{@const {
						channel_account_id: channelAccountId,
						channel_type: channelType,
						channel_account_name: channelAccountName
					} = account}
					{@const instagramAt = channelType == 'instagram' ? '@' : ''}
					<SideMenu.Content value={channelAccountId} class="py-4">
						<div class="flex items-center space-x-2">
							<img src={ChannelIcons[channelType]} alt="" class="w-10 h-10" />
							<h3>{instagramAt}{channelAccountName}</h3>
						</div>

						<Separator class="my-4" />

						<Dialog.Root open={disconnectDialogOpen}>
							<Dialog.Trigger>
								<Button variant="destructive">Disconnect Account</Button>
							</Dialog.Trigger>
							<Dialog.Content>
								<Dialog.Header>
									<Dialog.Title>Are you sure?</Dialog.Title>
									<Dialog.Description
										>You will be removing access to this channel which includes messages and events.</Dialog.Description
									>
								</Dialog.Header>
								<Dialog.Footer>
									<Dialog.Close>
										<Button variant="secondary">Nevermind</Button>
									</Dialog.Close>
									<Button type="submit" click={async () => await deleteAccount(channelAccountId)}
										>Yes, Disconnect</Button
									>
								</Dialog.Footer>
							</Dialog.Content>
						</Dialog.Root>
					</SideMenu.Content>
				{/each}
			{/if}
		</Tabs.Root>
	</div>
</div>
