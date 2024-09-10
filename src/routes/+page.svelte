<script>
	import { Button } from '$ui/button';
	import img from '$lib/images/logo_omni.svg';
	import bg from '$lib/images/bg.png';
	import { ChartColumn } from 'lucide-svelte';
</script>

<header class="flex items-center p-6 h-24 justify-between border-b-2">
	<a href=" " class="items-start pl-6 justify-start"><img class="h-16" src={img} alt="" /></a>
	<div class="flex space-x-8 items-center justify-end sm:justify-end">
		<button>Features</button>
		<button>Pricing</button>
		<button>About Us</button>
		<Button>Sign In</Button>
		<Button>Sign Up</Button>
	</div>
</header>

<div
	class="flex flex-col items-center justify-center h-[calc(100vh-24px)] border-slate-100"
	style="background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url('{bg}'); background-size: cover; background-repeat: no-repeat;">
	<h1 class="font-bold text-5xl/[55px]">Welcome to OmniLink</h1>
	<p class="p-5 text-slate-500">We make your job easier</p>
	<Button>Get Started</Button>
</div>

<div class="flex flex-col justify-center items-center bg-[#dce8f1] h-[calc(100vh-24px)] py-8">
	<h1 class="font-bold text-4xl pb-7 underline underline-offset-8">Features</h1>
	<p class="pb-8 text-slate-500">Get to Know Omnilink Features</p>
	<div class="flex justify-center px-8 gap-64 max-md:flex-col text-justify max-md:gap-20 [&>div]:gap-20 [&>div>div]:max-w-96">
		<div class="flex flex-col">
			<div>
				<ChartColumn />
				<p class="font-semibold pb-2">Insightful Analytics</p>
				<p>
					OmniLink delivers detailed insights from all your sales channels, helping you make
					data-driven decisions to drive business growth.
				</p>
			</div>
			<div>
				<p class="font-semibold pb-2">Integrated Communication</p>
				<p>
					Seamlessly connect and communicate across all platforms, enhancing collaboration and
					ensuring consistent messaging throughout your organization.
				</p>
			</div>
		</div>
		<div class="flex flex-col pb-2">
			<div>
				<p class="font-semibold pb-2">Comprehensive Data Management</p>
				<p>
					Efficiently manage and analyze data from various channels, providing tools to handle your
					data inventory in one platform.
				</p>
			</div>
			<div>
				<p class="font-semibold pb-2">Better Transaction Handling</p>
				<p>
					Optimize your transaction processes in one platform for improved efficiency and customer
					satisfaction across all sales channels.
				</p>
			</div>
		</div>
	</div>
</div>

<div class="flex flex-col py-10 items-center h-[calc(100vh-24px)]">
	<h1 class="font-bold text-4xl pb-5">Pricing</h1>
	<p class="pb-5 text-slate-500">Affordable plans for any needs. Cancel anytime.</p>
	<div>

	</div>
</div>
