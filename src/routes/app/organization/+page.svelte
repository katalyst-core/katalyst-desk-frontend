<script lang="ts">
	import { Button } from '$ui/button';
	import { onMount } from 'svelte';

	const initFB = () => {
		FB.login(
			(response) => {
				if (response.authResponse) {
					// User successfully logged in
					FB.api('/me', { fields: 'name,email' }, function (userInfo) {
						console.log('User Info:', userInfo);

						// Send userInfo to your backend to create an account or log them in
						// Example data: userInfo.name, userInfo.email
					});
				} else {
					// User cancelled login or did not fully authorize
					console.log('User cancelled login or did not fully authorize.');
				}
			},
			{ scope: 'public_profile,email' }
		);
	};

	let FB: any;
	onMount(() => {
		const windowRef: any = window;
		if (typeof windowRef.FB !== 'undefined') {
			FB = windowRef.FB;
		}

		//... you could also do this:
		const global: any = globalThis; // if using Typescript
		setTimeout(() => (FB = global.FB), 0);
	});
</script>

this manages the organizatizns
<Button on:click={initFB}>
  Login with Facebook
</Button>
