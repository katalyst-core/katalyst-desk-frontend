<script lang="ts">
	import { Plus, X } from 'lucide-svelte';
	import { page } from '$app/stores';

	import { Badge } from '$ui/badge';
	import { Combobox, type ComboboxItem } from '$ui/combobox';

	import { OrganizationAPI } from '$api/.';

	interface Props {
		teams: {
			team_id: string;
			name: string;
		}[];
		agentId: string;
		callback: (...args: any[]) => any;
	}

	let { teams, agentId, callback }: Props = $props();

	let items: ComboboxItem[] | null = $state(null);
	let open = $state(false);
	let isLoading = $state(false);

	let orgId = $derived($page.params.org);

	$effect(() => {
		if (open) fetchTeams();
	});

	const fetchTeams = async () => {
		const { ok, data: resData } = await OrganizationAPI.getUnassignedTeams(orgId, agentId);

		if (!ok) return;

		items = resData.map((d) => ({ value: d.team_id, label: d.name }));
	};

	const onSelect = async (teamId: string) => {
		isLoading = true;

		await OrganizationAPI.assignTeamToAgent(orgId, agentId, teamId);

    callback();

		isLoading = false;
	};

	const deleteClick = async (teamId: string) => {
		isLoading = true;

		await OrganizationAPI.unassignTeamFromAgent(orgId, agentId, teamId);

    callback();

		isLoading = false;
	}
</script>

<div class="flex flex-wrap gap-1">
	{#each teams as team (team.team_id)}
		<Badge class="flex items-center px-2 gap-1"
			>{team.name}
			<button onclick={() => deleteClick(team.team_id)} disabled={isLoading}>
				<X class="w-3 h-3" />
			</button>
		</Badge>
	{/each}
	<Combobox {items} {onSelect} bind:open disabled={isLoading}>
		<button disabled={isLoading}>
			<Badge class="p-1"><Plus class="w-3 h-3" /></Badge>
		</button>
	</Combobox>
</div>
