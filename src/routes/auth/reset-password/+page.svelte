<script>
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { goto } from '$app/navigation';

	import * as Form from '$ui/form';
	import { LoadingPage } from '$module/page';
	import { BrandLogo } from '$module/general';

	import * as AuthAPI from '$api/auth-api';
	import { resetPasswordSchema } from '$schema/agent-schema';

	let isRequestLoading = false;
	let isFormLoading = true;

	const form = superForm(defaults(zod(resetPasswordSchema)), {
		SPA: true,
		validators: zodClient(resetPasswordSchema),
		async onUpdate({ form }) {
			if (!form.valid) {
				return;
			}

			isRequestLoading = true;

			const urlParams = new URLSearchParams(window.location.search);
			const token = urlParams.get('token');
			const { newPassword } = form.data;
			const response = await AuthAPI.resetPassword(token || '', newPassword);

			isRequestLoading = false;

			if (!response.ok) {
				const { message } = response;
				setError(form, message);
				return;
			}

			goto(`/auth/sign-in`, {
				invalidateAll: true
			});
		}
	});

	const { form: formData, enhance } = form;
	isFormLoading = !form;
</script>

<LoadingPage bind:loading={isFormLoading}>
	<div class="flex flex-col justify-center items-center w-screen h-screen space-y-8">
		<BrandLogo />
		<div
			class="flex flex-col items-center gap-5 px-8 py-14 rounded-lg shadow-lg border border-gray-200"
		>
			<div class="text-center">
				<h1 class="font-bold">Create new password</h1>
			</div>
			<form method="POST" use:enhance class="flex flex-col w-96 gap-3">
				<Form.Field {form} name="newPassword">
					<Form.Control>
						<Form.Label>New Password</Form.Label>
						<Form.Input
							bind:value={$formData.newPassword}
							disabled={isRequestLoading}
							type="password-toggle"
							placeholder="New Password"
						/>
					</Form.Control>
					<Form.FieldErrors />
					<Form.Button bind:loading={isRequestLoading} class="w-full">Change Password</Form.Button>
				</Form.Field>
			</form>
		</div>
	</div>
</LoadingPage>
