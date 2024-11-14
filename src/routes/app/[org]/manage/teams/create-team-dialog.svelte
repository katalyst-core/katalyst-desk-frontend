<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import { Button } from '$ui/button';
	import * as Dialog from '$ui/dialog';
	import { Input } from '$ui/input';
	import { Label } from '$ui/label';

	import { createTeamSchema } from '$schema/team-schema';
	import { OrganizationAPI } from '$api/index';

	interface Props {
		children: Snippet;
		callback?: () => void;
	}

	let { children, callback }: Props = $props();

	let isLoading: boolean = $state(false);
  let isOpen: boolean = $state(false);

	let activeOrgId = $derived($page.params.org);

	const { form, errors, enhance, submit } = superForm(defaults(zod(createTeamSchema)), {
		SPA: true,
		validators: zodClient(createTeamSchema),
		warnings: {
			duplicateId: false
		},
		async onUpdate({ form }) {
			if (!form.valid) {
				return;
			}

			isLoading = true;

			const { name } = form.data;
			const response = await OrganizationAPI.createTeam(name, activeOrgId);

			isLoading = false;

			if (!response || !response.ok) {
				setError(form, response?.message || 'Error');
				return;
			}

      callback?.();

      isOpen = false;
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger>
		{@render children()}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create new Team</Dialog.Title>
		</Dialog.Header>

		<form method="POST" use:enhance>
			<div>
				<Label for="name">Team Name</Label>
				<Input id="name" bind:value={$form.name} placeholder="Finance" disabled={isLoading} />
				{#if $errors.name}<p class="text-destructive-foreground ml-[2px]">{$errors.name}</p>{/if}
			</div>
		</form>

		<Dialog.Footer>
			<Button onclick={submit} bind:loading={isLoading}>Create</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
