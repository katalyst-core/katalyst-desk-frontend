<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import ChannelCard from './channel-card.svelte';
	import NewChannelCard from './new-channel-card.svelte';
	import { LoadingPage } from '$module/page';

	import { OrganizationAPI } from '$api/index';
	import type { ChannelAccount } from '$types/channel-type';

	let activeOrgId = $page.params.org;
	let accounts: ChannelAccount[] | null = $state(null);

	const getChannelAccounts = async () => {
		if (!activeOrgId) return;

		accounts = null;
		const { ok, data } = await OrganizationAPI.getChannels(activeOrgId);

		if (!ok) return;

		accounts = data;
	};

	onMount(async () => {
		await getChannelAccounts();
	});
</script>

<div class="w-full p-4 flex flex-wrap gap-4 justify-start items">
	{#if accounts == null}
		<LoadingPage />
	{:else}
		{#each accounts as account}
			<ChannelCard
				id={account.channel_account_id}
				name={account.channel_account_name}
				type={account.channel_type}
				callback={getChannelAccounts}
			/>
		{/each}
		<NewChannelCard callback={getChannelAccounts} />
	{/if}
</div>
