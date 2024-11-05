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
<Button on:click={initFB}>Login with Facebook</Button>

<Button href="https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=1081015663664011&redirect_uri=https://katalyst-frontend.jtbernas.com/app/channel/instagram/auth&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish&state=qU2vUY3kDDF5ga6Wb4kLNr">
	Instagram Login
</Button>

<!-- <a
	href="https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=1081015663664011&redirect_uri=https://katalyst-frontend.jtbernas.com/app/channel/instagram/auth&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish&state={$selectedOrganization}"
	>Instagram Login</a
> -->
