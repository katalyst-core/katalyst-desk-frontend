<script lang="ts">
	import { Check, ChevronDown } from 'lucide-svelte';

	import * as Popover from '$ui/popover';
	import * as Command from '$ui/command';
	import { Button } from '$ui/button';

  import { OrganizationAPI } from '$api/index';
	import type { TicketTeam } from '$types/ticket-type';

	interface Props {
    teams: TicketTeam[];
    ticketId: string;
    orgId: string;
	}
	let { teams, orgId, ticketId }: Props = $props();

	const toggleTeam = async (idx: number) => {
		const team = teams[idx];

		if (team.active) {
			teams[idx].active = false;

			const { ok } = await OrganizationAPI.removeTeamFromTicket(orgId, ticketId, team.team_id);
      if (!ok) teams[idx].active = true;
		} else {
      teams[idx].active = true;
			const { ok } = await OrganizationAPI.addTeamToTicket(orgId, ticketId, team.team_id);
      if (!ok) teams[idx].active = false;
		}
	};
</script>

<Popover.Root>
	<Popover.Trigger>
		<Button variant="outline">
			<span>
				{teams.filter(t => t.active).length} Teams
			</span>
			<ChevronDown />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.List>
				<Command.Group>
					{#each teams as team, idx (team.team_id)}
						<Command.Item
							value={team.team_id}
							onSelect={() => toggleTeam(idx)}
							class="cursor-pointer"
						>
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
