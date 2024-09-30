<script>
	import icon from '$lib/images/logo_omni.svg';
	import chromeIcon from '$lib/images/icons/chrome.svg';
	import emailIcon from '$lib/images/icons/email.svg';
	import facebookIcon from '$lib/images/icons/facebook.svg';
	import lineIcon from '$lib/images/icons/line.svg';
	import twitterIcon from '$lib/images/icons/twitter.svg';
	import whatsappIcon from '$lib/images/icons/whatsapp.svg';
  import instagramIcon from '$lib/images/icons/instagram.svg';

	let layers = [
		{
			size: 400,
			icons: [
				{ name: 'Web', icon: chromeIcon },
				{ name: 'Twitter', icon: twitterIcon },
				{ name: 'Email', icon: emailIcon },
				{ name: 'Facebook', icon: facebookIcon },
				{ name: 'WhatsApp', icon: whatsappIcon },
				{ name: 'LINE', icon: lineIcon },
				{ name: 'Instagram', icon: instagramIcon }
			]
		}
	];
</script>

<div class="relative w-[300px] h-[300px] flex items-center justify-center">
	<div
		class="absolute w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center z-10"
	>
		<img src={icon} alt="Logo" class="w-full h-full object-contain" />
	</div>

	{#each layers as layer, _}
		<div
			class="orbit absolute flex justify-center items-center"
			style="width: {layer.size}px; height: {layer.size}px;"
		>
			{#each layer.icons as icon, i}
				<div
					class="icon absolute w-24 h-24 rounded-full flex items-center justify-center"
					style="transform: rotate(calc(360deg / {layer.icons.length} * {i})) translate(0, -{layer.size / 2}px);"
				>
					<div style="transform: rotate(calc(-360deg / {layer.icons.length} * {i}))">
						<img src={icon.icon} alt={icon.name} class="inner-icon w-full h-full object-cover" />
					</div>
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes counter-rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(-360deg);
		}
	}

	.orbit {
		animation: rotate linear infinite;
		animation-duration: 10s;
	}

	.icon:hover {
		transform: scale(1.2);
	}

	.inner-icon {
		animation: counter-rotate linear infinite;
		animation-duration: 10s;
	}
</style>
