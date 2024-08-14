<script>
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import toast from 'svelte-french-toast';

	import * as Form from '$ui/form';
  import { LoadingPage } from '$module/page';

	import { signInSchema } from '$lib/schema';
	import { fetchApi } from '$lib/custom-fetch';

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

			try {
				const response = await fetchApi('/auth/login', {
					method: 'POST',
					noRefresh: true,
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						username: form.data.username,
						password: form.data.password
					})
				});

				if (!response) {
					return;
				}

				if (!response.ok) {
					isRequestLoading = false;

					let message = response.message;
					const code = response.error?.code;
					if (code === 'UNABLE_TO_FIND_ACCOUNT') {
						message = 'Invalid username or password';
					}

					toast.error(message);
					setError(form, message);

					return;
				}

				const newUrl = '/app/dashboard';
				window.location.href = newUrl;
			} catch (_) {
				isRequestLoading = false;
				toast.error('An error occurred');
			}
		}
	});

	const { form: formData, enhance } = form;
	isFormLoading = !form;
</script>

<LoadingPage bind:loading={isFormLoading}>
	<div class="flex justify-center items-center w-screen h-screen">
		<div class="flex flex-col items-center gap-5">
			<div class="text-center">
				<h1 class="font-bold">Welcome</h1>
				<p class="text-gray-500">Please sign-in to continue</p>
			</div>
			<form method="POST" use:enhance class="flex flex-col w-96 gap-3">
				<Form.Field {form} name="username">
					<Form.Control>
						<Form.Label>Username / Email</Form.Label>
						<Form.Input
							bind:value={$formData.username}
							disabled={isRequestLoading}
							placeholder="Username / Email"
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
				<Form.Button size="lg" bind:loading={isRequestLoading} class="w-full">Sign In</Form.Button>
			</form>
			<p>Don't have an account? <a href="/auth/sign-up" class="text-gray-600">Sign Up</a></p>
		</div>
	</div>
</LoadingPage>
