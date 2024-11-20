<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import { Button } from '$ui/button';
	import * as Dialog from '$ui/dialog';
	import { Input } from '$ui/input';
	import { Label } from '$ui/label';

	import { OrganizationAPI } from '$api/index';
	import { addAgentToOrganization } from '$schema/agent-schema';

	interface Props {
		children: Snippet;
		callback?: (...args: any[]) => void;
	}

	let { children, callback }: Props = $props();

	let isLoading: boolean = $state(false);
  let isOpen: boolean = $state(false);

	let activeOrgId = $derived($page.params.org);

	const { form, errors, enhance, submit } = superForm(defaults(zod(addAgentToOrganization)), {
		SPA: true,
		validators: zodClient(addAgentToOrganization),
		warnings: {
			duplicateId: false
		},
		async onUpdate({ form }) {
			if (!form.valid) {
				return;
			}

			isLoading = true;

			const { email } = form.data;
			const response = await OrganizationAPI.addAgent(email, activeOrgId);

			isLoading = false;

			if (!response.ok) {
				setError(form, 'email', response?.message || 'Error');
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
			<Dialog.Title>Add agent to organization</Dialog.Title>
		</Dialog.Header>

		<form method="POST" use:enhance>
			<div>
				<Label for="email">Agent Email</Label>
				<Input id="email" bind:value={$form.email} placeholder="jason@katalystdesk.com" disabled={isLoading} />
				{#if $errors.email}<p class="text-red-500 ml-[2px]">{$errors.email}</p>{/if}
			</div>
		</form>

		<Dialog.Footer>
			<Button onclick={submit} bind:loading={isLoading}>Create</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
