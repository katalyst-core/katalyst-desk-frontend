<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { onDestroy, onMount } from 'svelte';
	import { Plus } from 'lucide-svelte';
	import { Tabs } from 'bits-ui';

	import * as Dialog from '$ui/dialog';
	import * as SideMenu from '$module/navigation/side-tabs';
	import { LoadingPage } from '$module/page';
	import { Separator } from '$ui/separator';
	import { Skeleton } from '$ui/skeleton';
	import {
		Instagram,
		WhatsApp,
		Facebook,
		InstagramWhite,
		FacebookWhite
	} from '$lib/images/icons';

	import { PUBLIC_INSTAGRAM_AUTH_URL } from '$env/static/public';
	import { Button } from '$ui/button';
	import { ChannelAPI } from '$api/index';
	import type { ChannelAccount } from '$types/channel-type';

	interface WhatsAppAuth {
		phone_number_id: null;
		waba_id: null;
		code: null;
	}

	let FB: any;
	let activeOrgId = $page.params.org;
	let accounts: ChannelAccount[] | null = $state(null);
	let addChannelDialogOpen: boolean = $state(false);
	let disconnectDialogOpen: boolean = $state(false);
	let whatsAppAuth: WhatsAppAuth = $state({ phone_number_id: null, waba_id: null, code: null });
	let isAddChannelLoading = $state(false);

	$effect(() => {
		onCompletedWhatsAppAuth();
	});

	const deleteAccount = async (channelAccountId: string) => {
		const response = await ChannelAPI.deleteChannelAccount(channelAccountId);

		if (!response) {
			return;
		}

		disconnectDialogOpen = false;
		getChannelAccounts();
	};

	const getChannelAccounts = async () => {
		if (!activeOrgId) {
			return;
		}

		accounts = null;
		const response = await ChannelAPI.getChannelAccounts(activeOrgId);

		if (!response?.ok) {
			return;
		}

		accounts = response.data;
	};

	const fbAuthListener = (event: any) => {
		if (
			event.origin !== 'https://www.facebook.com' &&
			event.origin !== 'https://web.facebook.com'
		) {
			return;
		}

		try {
			const data = JSON.parse(event.data);
			if (data.type === 'WA_EMBEDDED_SIGNUP') {
				if (data.event === 'FINISH') {
					const { phone_number_id, waba_id } = data.data;

					whatsAppAuth.phone_number_id = phone_number_id;
					whatsAppAuth.waba_id = waba_id;

					return;
				}
			}
		} catch {}
	};

	const onCompletedWhatsAppAuth = async () => {
		const { phone_number_id, waba_id, code } = whatsAppAuth;

		if (!phone_number_id || !waba_id || !code) return;

		isAddChannelLoading = true;
		await ChannelAPI.authenticateWhatsApp(phone_number_id, waba_id, code, activeOrgId);
		isAddChannelLoading = false;
		addChannelDialogOpen = false;
		await getChannelAccounts();
	};

	const loadFB = () => {
		const windowRef: any = window;

		if (typeof windowRef.FB !== 'undefined') {
			FB = windowRef.FB;
		}
	};

	const loginFB = () => {
		loadFB();

		whatsAppAuth = {
			phone_number_id: null,
			waba_id: null,
			code: null
		};

		const fbLoginCallback = (response: any) => {
			if (response.authResponse) {
				const code = response.authResponse.code;

				whatsAppAuth.code = code;
			}
		};

		FB.login(fbLoginCallback, {
			config_id: '1620742872118434',
			response_type: 'code',
			override_default_response_type: true,
			extras: {
				setup: {},
				featureType: '',
				sessionInfoVersion: '2'
			}
		});
	};

	const ChannelIcons: Record<string, string> = {
		instagram: Instagram,
		whatsapp: WhatsApp,
		facebook: Facebook
	};

	interface Connections {
		label: string;
		icon: string;
		color: string;
		href?: string;
		click?: () => void;
		disabled?: boolean;
	}

	const ChannelConnections: Connections[] = [
		{
			label: 'Login with Instagram',
			icon: InstagramWhite,
			color:
				'bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]',
			href: `${PUBLIC_INSTAGRAM_AUTH_URL}&state=${activeOrgId}`
		},
		{
			label: 'Login with Facebook',
			icon: FacebookWhite,
			color: 'bg-[#0866FF]',
			click: loginFB
		}
	];

	onMount(async () => {
		await getChannelAccounts();

		window.addEventListener('message', fbAuthListener);
	});

	onDestroy(() => {
		window.removeEventListener('message', fbAuthListener);
	});
</script>

<svelte:head>
	<script>
		window.fbAsyncInit = function () {
			FB.init({
				appId: '2907775516040467',
				autoLogAppEvents: true,
				xfbml: true,
				version: 'v21.0'
			});
		};
	</script>
	<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js">
	</script>
</svelte:head>

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

				<Dialog.Root bind:open={addChannelDialogOpen}>
					<Dialog.Trigger
						class="flex space-x-2 justify-center items-center h-10 rounded-md hover:bg-gray-200 transition-colors"
					>
						<Plus class="w-4 h-4" /><span>Add channel</span>
					</Dialog.Trigger>
					<Dialog.Content class="max-w-[40rem]">
						<Dialog.Header>
							<Dialog.Title>Add Connections</Dialog.Title>
						</Dialog.Header>
						{#if isAddChannelLoading}
							<LoadingPage />
						{:else}
							<div class="grid grid-cols-2 gap-2">
								{#each ChannelConnections as connection}
									<a
										href={connection.href || '#'}
										onclick={connection.click}
										class={cn(
											`flex items-center px-4 py-2 space-x-6 text-base font-semibold text-white rounded-md ${connection.disabled ? 'brightness-90 cursor-not-allowed' : 'hover:brightness-90'} transition-all`,
											connection.color
										)}
									>
										<img src={connection.icon} alt="" class="w-7 h-7" />
										<span>{connection.label}</span>
									</a>
								{/each}
							</div>
						{/if}
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
