<script>
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import * as Form from '$ui/form';
	import { LoadingPage } from '$module/page';
	import { BrandLogo } from '$module/general';

	import * as AuthAPI from '$api/auth-api';
	import { signInSchema } from '$schema/agent-schema';
	import { persistedAccessToken } from '$stores/authentication-store';

	let isRequestLoading = false;
	let isFormLoading = true;

	const form = superForm(defaults(zod(signInSchema)), {
		SPA: true,
		validators: zodClient(signInSchema),
		async onUpdate({ form }) {
			if (!form.valid) {
				return;
			}

			isRequestLoading = true;

			const { email, password } = form.data;
			const response = await AuthAPI.login(email, password);

			if (!response.ok) {
				const { message } = response;
				setError(form, message);
				isRequestLoading = false;
				return;
			}

			const { auth_token: authToken } = response.data;
			$persistedAccessToken = authToken;

			const newUrl = '/app';
			window.location.href = newUrl;
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
				<h1 class="font-bold">Welcome</h1>
				<p class="text-gray-500">Please sign-in to continue</p>
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
				</Form.Field>
				<Form.Field {form} name="password">
					<Form.Control>
						<Form.Label>Password</Form.Label>
						<Form.Input
							bind:value={$formData.password}
							disabled={isRequestLoading}
							type="password-toggle"
							placeholder="Password"
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button bind:loading={isRequestLoading} class="w-full">Sign In</Form.Button>
			</form>
			<p>Don't have an account? <a href="/auth/sign-up" class="text-gray-600">Sign Up</a></p>
		</div>
	</div>
</LoadingPage>
