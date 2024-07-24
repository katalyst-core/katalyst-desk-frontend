<script>
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import toast from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import { signUpSchema } from '$lib/schema';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { fetchApi } from '$lib/custom-fetch';
	import LoadingPage from '$lib/components/module/page/LoadingPage.svelte';
	import PasswordInput from '$lib/components/module/ui/PasswordInput.svelte';

	let isRequestLoading = false;
	let isFormLoading = true;

	const { form, errors, enhance } = superForm(defaults(zod(signUpSchema)), {
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

	onMount(() => {
		if (form) {
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
				<div>
					<Label for="name">Name</Label>
					<Input
						id="name"
						bind:value={$form.name}
						placeholder="Name"
						disabled={isRequestLoading}
						class={$errors.name ? 'error' : ''}
					/>
					{#if $errors.name}<p class="text-red-600 ml-[2px]">{$errors.name}</p>{/if}
				</div>
				<div>
					<Label for="username">Username</Label>
					<Input
						id="username"
						bind:value={$form.username}
						placeholder="Username"
						disabled={isRequestLoading}
						class={$errors.username ? 'error' : ''}
					/>
					{#if $errors.username}<p class="text-red-600 ml-[2px]">{$errors.username}</p>{/if}
				</div>
				<div>
					<Label for="email">Email address</Label>
					<Input
						id="email"
						type="email"
						bind:value={$form.email}
						placeholder="Email address"
						disabled={isRequestLoading}
						class={$errors.email ? 'error' : ''}
					/>
					{#if $errors.email}<p class="text-red-600 ml-[2px]">{$errors.email}</p>{/if}
				</div>
				<div>
					<Label for="password">Password</Label>
					<PasswordInput
						id="password"
						bind:value={$form.password}
						placeholder="Password"
						disabled={isRequestLoading}
						class={$errors.password ? 'error' : ''}
					/>
					{#if $errors.password}<p class="text-red-600 ml-[2px]">{$errors.password}</p>{/if}
				</div>
				<Button type="submit" size="lg" bind:loading={isRequestLoading} class="w-full"
					>Sign Up</Button
				>
			</form>
			<p>Already have an account? <a href="/auth/sign-in" class="text-gray-600">Sign In</a></p>
		</div>
	</div>
</LoadingPage>
