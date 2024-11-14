<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronUp } from 'lucide-svelte';

	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$ui/dropdown-menu';
	import * as Sidebar from '$ui/sidebar';
	import { UserMenu } from '.';
	import { getTextInitials } from '$utils/index';
	import { agent } from '$stores/agent';

	let name = $state('');
	let email = $state('');
	let initials = $state('');

	const getAgentData = () => {
		agent.subscribe((agent) => {
			if (!agent) return;

			name = agent.name;
			email = agent.email;
			initials = getTextInitials(agent.name);
		});
	};

	onMount(() => {
		getAgentData();
	});
</script>

<UserMenu>
	{#snippet children({ props })}
		<Sidebar.MenuButton
			{...props}
			class="flex justify-between items-center w-full h-16 px-2 select-none cursor-pointer text-left rounded-xl transition-all data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
		>
			<div class="flex items-center gap-2">
				<Avatar.Root>
					<Avatar.Image src="" alt="" />
					<Avatar.Fallback class="font-medium">{initials}</Avatar.Fallback>
				</Avatar.Root>
				<div class="flex flex-col justify-center font-medium">
					<p class="w-32 truncate">{name}</p>
					<p class="w-32 truncate text-sm opacity-65">{email}</p>
				</div>
			</div>
			<ChevronUp class="w-6 h-6 mx-2" />
		</Sidebar.MenuButton>
	{/snippet}
</UserMenu>