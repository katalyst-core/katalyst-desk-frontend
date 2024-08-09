<script>
  import { onMount } from 'svelte';
  import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import toast from 'svelte-french-toast';

  import { Button } from '$ui/button';
  import { Input } from '$ui/input';
  import { Label } from '$ui/label';
	import { PasswordInput } from '$ui/password-input';

	import { signInSchema } from '$lib/schema';
  import { fetchApi } from '$lib/custom-fetch';
	import LoadingPage from '$lib/components/module/page/LoadingPage.svelte';


  let isRequestLoading = false;
  let isFormLoading = true;

  const { form, errors, enhance } = superForm(defaults(zod(signInSchema)), {
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
            'Content-Type': 'application/json',
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
        <h1 class="font-bold">Welcome</h1>
        <p class="text-gray-500">Please sign-in to continue</p>
      </div>
      <form method="POST" use:enhance class="flex flex-col w-96 gap-3">
        <div>
          <Label for="username">Username / Email</Label>
          <Input id="username" bind:value={$form.username} placeholder="Username / Email" disabled={isRequestLoading} class={ $errors.username ? 'error' : '' } />
          {#if $errors.username}<p class="text-red-600 ml-[2px]">{ $errors.username }</p>{/if}
        </div>
        <div>
          <Label for="password">Password</Label>
          <PasswordInput id="password" bind:value={$form.password} placeholder="Password" disabled={isRequestLoading} class={ $errors.password ? 'error' : '' } />
          {#if $errors.password}<p class="text-red-600 ml-[2px]">{ $errors.password }</p>{/if}
        </div>
        <Button type="submit" size="lg" bind:loading={isRequestLoading} class="w-full">Sign In</Button>
      </form>
      <p>Don't have an account? <a href="/auth/sign-up" class="text-gray-600">Sign Up</a></p>
    </div>
  </div>
</LoadingPage>