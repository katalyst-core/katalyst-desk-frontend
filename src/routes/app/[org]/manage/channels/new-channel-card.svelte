<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Plus } from 'lucide-svelte';
	import { page } from '$app/stores';

	import * as Sheet from '$ui/sheet';
	import { Separator } from '$ui/separator';
	import { Instagram, WhatsApp, InstagramWhite, FacebookWhite } from '$lib/images/icons';

	import { PUBLIC_FACEBOOK_CLIENT_ID, PUBLIC_INSTAGRAM_AUTH_URL, PUBLIC_WHATSAPP_FACEBOOK_CONFIG_ID } from '$env/static/public';
	import { ChannelAPI } from '$api/.';
	import { LoadingPage } from '$module/page';

	interface Props {
		callback: (...args: any[]) => any;
	}

	let { callback }: Props = $props();

	interface Connections {
		label: string;
		icon: string;
		color: string;
		methods: {
			label: string;
			icon: string;
			color: string;
			href?: string;
			click?: () => void;
			disabled?: boolean;
		}[];
	}

	interface WhatsAppAuth {
		phone_number_id: null;
		waba_id: null;
		code: null;
	}

	let FB: any;
	let activeOrgId = $page.params.org;
	let whatsAppAuth: WhatsAppAuth = $state({ phone_number_id: null, waba_id: null, code: null });
	let sheetOpen: boolean = $state(false);
	let isLoading: boolean = $state(false);

	$effect(() => {
		onCompletedWhatsAppAuth();
	});

	//#region WhatsApp Facebook Login

	const loginWhatsappFB = () => {
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
			config_id: PUBLIC_WHATSAPP_FACEBOOK_CONFIG_ID,
			response_type: 'code',
			override_default_response_type: true,
			extras: {
				setup: {},
				featureType: '',
				sessionInfoVersion: '2'
			}
		});
	};

	const onCompletedWhatsAppAuth = async () => {
		const { phone_number_id, waba_id, code } = whatsAppAuth;

		if (!phone_number_id || !waba_id || !code) return;

		isLoading = true;
		await ChannelAPI.authenticateWhatsApp(phone_number_id, waba_id, code, activeOrgId);
		sheetOpen = false;
		isLoading = false;
		callback();
	};

	//#endregion

	//#region Facebook Authentication
	const loadFB = () => {
		const windowRef: any = window;

		if (typeof windowRef.FB !== 'undefined') {
			FB = windowRef.FB;
		}
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

	const setFBHeader = () => {
		const script = document.createElement('script');
		script.textContent = `
      window.fbAsyncInit = function () {
        FB.init({
          appId: "${PUBLIC_FACEBOOK_CLIENT_ID}",
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v21.0'
        });
      };
    `;
		document.head.appendChild(script);
	};

	//#endregion

	const connections: Connections[] = [
		{
			label: 'Instagram',
			icon: Instagram,
			color:
				'bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]',
			methods: [
				{
					label: 'Login with Instagram',
					icon: InstagramWhite,
					color:
						'bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]',
					href: `${PUBLIC_INSTAGRAM_AUTH_URL}&state=${activeOrgId}`
				}
			]
		},
		{
			label: 'WhatsApp',
			icon: WhatsApp,
			color: 'bg-[#0866FF]',
			methods: [
				{
					label: 'Login with Facebook',
					icon: FacebookWhite,
					color: 'bg-[#0866FF]',
					click: loginWhatsappFB
				}
			]
		}
	];

	onMount(() => {
		setFBHeader();
		loadFB();

		window.addEventListener('message', fbAuthListener);
	});

	onDestroy(() => {
		window.removeEventListener('message', fbAuthListener);
	});
</script>

<svelte:head>
	<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js">
	</script>
</svelte:head>

<Sheet.Root open={sheetOpen}>
	<Sheet.Trigger>
		<div
			class="w-96 h-48 rounded-md border border-border overflow-hidden flex flex-col justify-center items-center gap-2 hover:bg-accent transition-all"
		>
			<Plus class="w-8 h-8 rounded-full bg-accent" />
			<span>Connect New Channel</span>
		</div>
	</Sheet.Trigger>
	<Sheet.Content class="px-4 pt-12 space-y-4">
		{#if isLoading}
			<LoadingPage />
		{:else}
			{#each connections as connection}
				<div class="w-full border border-border rounded-md overflow-hidden">
					<div class="flex items-center space-x-2 p-4">
						<img class="w-10 h-10" src={connection.icon} alt="" />
						<h2 class="font-semibold">{connection.label}</h2>
					</div>

					<Separator />

					<div class="p-4">
						{#each connection.methods as method}
							<a
								href={method.href || '#'}
								onclick={method.click}
								class="flex items-center px-4 py-2 space-x-6 text-base font-semibold text-white rounded-md transition-all {method.color} hover:brightness-90"
							>
								<img src={method.icon} alt="" class="w-7 h-7" />
								<span>{method.label}</span>
							</a>
						{/each}
					</div>
				</div>
			{/each}
		{/if}
	</Sheet.Content>
</Sheet.Root>
