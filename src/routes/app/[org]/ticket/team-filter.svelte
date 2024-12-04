<script lang="ts">
	import { Check, ChevronDown } from 'lucide-svelte';

	import * as Popover from '$ui/popover';
	import * as Command from '$ui/command';
	import { Button } from '$ui/button';

	import { OrganizationAPI } from '$api/index';
	import type { TeamListItem } from '$types/team-type';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	interface TeamList extends TeamListItem {
		active: boolean;
	}

	interface Props {
		selectedTeams: string[];
	}
	let { selectedTeams = $bindable([]) }: Props = $props();

	let teams: TeamList[] = $state([]);

	let orgId = $derived($page.params.org);

	const toggleTeam = (idx: number) => {
		teams[idx].active = !teams[idx].active;

		selectedTeams = teams.reduce((prev, curr) => {
			if (curr.active) prev.push(curr.team_id);
			return prev;
		}, [] as string[]);
	};

	const getTeams = async () => {
		const response = await OrganizationAPI.getTeams(orgId);

		if (!response.ok) return;

		teams = response.data.map((d) => {
			return {
				...d,
				active: false
			};
		});
	};

	onMount(() => {
		getTeams();
	});
</script>

<Popover.Root>
	<Popover.Trigger>
		<Button variant="outline">
			<span>
				{selectedTeams.length} Teams
			</span>
			<ChevronDown />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.List>
				<Command.Group>
					{#each teams as team, idx (team)}
						<Command.Item value={team.team_id} onSelect={() => toggleTeam(idx)} class="cursor-pointer">
							<div
								class="w-5 h-5 flex justify-center items-center border border-primary rounded-md {team.active &&
									'bg-primary'} transition-all"
							>
								{#if team.active}
									<Check class="w-4 h-4 text-secondary" />
								{/if}
							</div>
							{team.name}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
