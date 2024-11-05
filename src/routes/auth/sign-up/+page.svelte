<script>
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-french-toast';

	import * as Form from '$ui/form';
	import { LoadingPage } from '$module/page';
	import { BrandLogo } from '$module/general';

	import * as AuthAPI from '$api/auth-api';
	import { signUpSchema } from '$schema/agent-schema';

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

			const { name, email, password } = form.data;
			const response = await AuthAPI.createAgent(name, email, password);

			isRequestLoading = false;

			if (response && !response.ok) {
				const { message } = response;
				setError(form, message);
				return;
			}

			toast.success('Account created, please login');

			await goto('/auth/sign-in', {
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
						<Form.Input
							bind:value={$formData.password}
							placeholder="Password"
							type="password-toggle"
							disabled={isRequestLoading}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button bind:loading={isRequestLoading} class="w-full">Sign Up</Form.Button>
			</form>
			<p>Already have an account? <a href="/auth/sign-in" class="text-gray-600">Sign In</a></p>
		</div>
	</div>
</LoadingPage>
