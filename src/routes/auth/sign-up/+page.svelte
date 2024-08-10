<script>
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import toast from 'svelte-french-toast';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import * as Form from '$ui/form';

	import { signUpSchema } from '$lib/schema';
	import { fetchApi } from '$lib/custom-fetch';
	import LoadingPage from '$lib/components/module/page/LoadingPage.svelte';

	let isRequestLoading = false;
	let isFormLoading = true;

	const form = superForm(defaults(zod(signUpSchema)), {
		SPA: true,
		validators: zodClient(signUpSchema),
		async onUpdate({ form }) {
			if (!form.valid) {
				return;
			}

			isRequestLoading = true;

			const response = await fetchApi('/auth/create', {
				method: 'POST',
				noRefresh: true,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: form.data.name,
					username: form.data.username,
					email: form.data.email,
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
				if (code === 'ACCOUNT_USERNAME_ALREADY_EXIST') {
					message = 'Username already exist';
				}
				if (code === 'ACCOUNT_EMAIL_ALREADY_EXIST') {
					message = 'Email already exist';
				}

				toast.error(message);
				setError(form, message);

				return;
			}

			await goto('/', {
				invalidateAll: true
			});
		}
	});

	const { form: formData, errors, enhance } = form;

	onMount(() => {
		if (formData) {
			isFormLoading = false;
		}
	});
</script>

<LoadingPage bind:loading={isFormLoading}>
	<div class="flex justify-center items-center w-screen h-screen">
		<div class="flex flex-col items-center gap-5">
			<div class="text-center">
				<h1 class="font-bold">Get started</h1>
				<p class="text-gray-500">Create a new account</p>
			</div>
			<form method="POST" use:enhance class="flex flex-col w-96 gap-3">
				<Form.Field {form} name="name">
					<Form.Control>
						<Form.Label>Name</Form.Label>
						<Form.Input
							bind:value={$formData.name}
							placeholder="Name"
							disabled={isRequestLoading}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="username">
					<Form.Control>
						<Form.Label>Username</Form.Label>
						<Form.Input
							bind:value={$formData.username}
							placeholder="Username"
							disabled={isRequestLoading}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="email">
					<Form.Control>
						<Form.Label>Email address</Form.Label>
						<Form.Input
							type="email"
							bind:value={$formData.email}
							placeholder="Email address"
							disabled={isRequestLoading}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="password">
					<Form.Control>
						<Form.Label>Password</Form.Label>
						<Form.PasswordInput
							bind:value={$formData.password}
							placeholder="Password"
							disabled={isRequestLoading}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button
					size="lg"
					bind:loading={isRequestLoading}
					class="w-full"
				>
					Sign Up
				</Form.Button>
			</form>
			<p>Already have an account? <a href="/auth/sign-in" class="text-gray-600">Sign In</a></p>
		</div>
	</div>
</LoadingPage>
