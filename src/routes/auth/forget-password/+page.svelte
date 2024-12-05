<script>
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import toast from 'svelte-french-toast';

	import * as Form from '$ui/form';
	import { LoadingPage } from '$module/page';
	import { BrandLogo } from '$module/general';

	import * as AuthAPI from '$api/auth-api';
	import { forgetPasswordSchema } from '$schema/agent-schema';

	let isRequestLoading = false;
	let isFormLoading = true;

	const form = superForm(defaults(zod(forgetPasswordSchema)), {
		SPA: true,
		validators: zodClient(forgetPasswordSchema),
		async onUpdate({ form }) {
			if (!form.valid) {
				return;
			}

			isRequestLoading = true;

			const { email } = form.data;
			const response = await AuthAPI.requestForgetPassword(email);

			isRequestLoading = false;

			if (!response.ok) {
				const { message } = response;
				setError(form, message);
				return;
			}

			toast.success('Please check your email');
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
				<h1 class="font-bold">Forget password</h1>
			</div>
			<form method="POST" use:enhance class="flex flex-col w-96 gap-3">
				<Form.Field {form} name="email">
					<Form.Control>
						<Form.Label>Email</Form.Label>
						<Form.Input
							bind:value={$formData.email}
							disabled={isRequestLoading}
							placeholder="Email"
						/>
					</Form.Control>
					<Form.FieldErrors />
				<Form.Button bind:loading={isRequestLoading} class="w-full">Request new Password</Form.Button>
				</Form.Field>
			</form>
		</div>
	</div>
</LoadingPage>
