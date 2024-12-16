<script lang="ts">
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { page } from '$app/stores';
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import * as Form from '$ui/form';

	import { Separator } from '$ui/separator';
	import { LoadingPage } from '$module/page';

	import { updateWelcomeMessageSchema } from '$schema/organization-schema';
	import { OrganizationAPI } from '$api/index';

	let isRequestLoading = $state(false);
	let isFormLoading = $state(true);
	let orgId = $derived($page.params.org);

	const form = superForm(defaults(zod(updateWelcomeMessageSchema)), {
		SPA: true,
		validators: zodClient(updateWelcomeMessageSchema),
		async onUpdate({ form }) {
			if (!form.valid) {
				return;
			}

			isRequestLoading = true;

			const { message: welcomeMessage } = form.data;

			const { ok, message } = await OrganizationAPI.updateWelcomeMessage(orgId, welcomeMessage);

			if (!ok) {
				isRequestLoading = false;
				setError(form, message);
				return;
			}

			toast.success('Successfully updated welcome message');
			fetchWelcomeMessage();
		}
	});

	const { form: formData, enhance } = form;

	const fetchWelcomeMessage = async () => {
		const { ok, data } = await OrganizationAPI.getWelcomeMessage(orgId);

		if (!ok) return;

		$formData.message = data.welcome_message;
		isRequestLoading = false;
	};

	onMount(async () => {
		await fetchWelcomeMessage();
		isFormLoading = false;
	});
</script>

<h1 class="p-4">Welcome Message</h1>

<Separator />

{#if isFormLoading}
	<LoadingPage />
{:else}
	<div class="w-full h-full p-4 space-y-8">
		<form method="POST" use:enhance class="flex flex-col justify-start w-96 gap-3">
			<Form.Field {form} name="message">
				<Form.Control>
					<Form.Label>Welcome Message (Leave it blank to disable welcome message)</Form.Label>
					<Form.Textarea
						bind:value={$formData.message}
						disabled={isRequestLoading}
						placeholder="Thanks for contacting us. We will be right with you"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button bind:loading={isRequestLoading}>Apply Changes</Form.Button>
		</form>
	</div>
{/if}
