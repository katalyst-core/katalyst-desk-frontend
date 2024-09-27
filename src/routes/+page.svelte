<script>
	import { ChartColumn } from 'lucide-svelte';
	import { Button } from '$ui/button';
	import * as Card from '$ui/card';
	import * as Tabs from '$ui/tabs';

	import img from '$lib/images/logo_omni.svg';
	import bg from '$lib/images/bg.png';
	import RotatingIcons from '$module/page/RotatingIcons.svelte';

	// @ts-ignore
	function scrollIntoView({ target }) {
		const el = document.querySelector(target.getAttribute('href'));
		if (!el) return;
		el.scrollIntoView({
			behavior: 'smooth'
		});
	}
</script>

<div
	class="flex flex-col h-svh"
	style="background: linear-gradient(135deg, rgba(255, 207, 103, 0.8), rgba(211, 50, 29, 0.8)); background-size: cover; background-repeat: no-repeat;"
>
	<header class="flex items-center p-6 h-24 justify-between text-lg" style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)); background-size: cover; background-repeat: no-repeat;">
		<a href=" " class="items-start pl-6 justify-start"><img class="h-16" src={img} alt="" /></a>
		<div class="flex space-x-8 items-center justify-end sm:justify-end">
			<a href="#landing-features" on:click|preventDefault={scrollIntoView}>Features</a>
			<a href="#landing-pricing" on:click|preventDefault={scrollIntoView}>Pricing</a>
			<a href="#landing-aboutus" on:click|preventDefault={scrollIntoView}>About Us</a>
			<div class="space-x-2">
				<Button variant="outline" href="/auth/sign-in" class="text-lg px-7 py-6">Sign In</Button>
				<Button href="/auth/sign-up" class="text-lg px-7 py-6">Sign Up</Button>
			</div>
		</div>
	</header>

	<div class="flex items-center px-24 flex-grow">
		<div class="flex flex-col items-start flex-1">
			<h1 class="font-bold text-6xl/[55px]">
				Reach Customers Everywhere. Respond to Their Needs Anywhere.
			</h1>
			<p class="text-slate-600 text-2xl py-2">
				Streamline your customer support with our omnichannel solution, enabling you to deliver personalized, timely, and cohesive experiences that exceed expectations.
			</p>
			<Button class="text-xl px-6 py-6 my-6 font-semibold">Try for free</Button>
		</div>
		<div class="flex justify-center flex-1">
			<RotatingIcons />
		</div>
	</div>
</div>

<div
	class="flex flex-col justify-center items-center bg-[#dce8f1] h-svh py-8"
	id="landing-features"
>
	<h1 class="font-bold text-4xl pb-7 underline underline-offset-8">Features</h1>
	<p class="pb-8 text-slate-500">Get to Know Omnilink Features</p>
	<div
		class="flex justify-center px-8 gap-64 max-md:flex-col text-justify max-md:gap-20 [&>div]:gap-20 [&>div>div]:max-w-96"
	>
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

<div class="flex flex-col py-10 items-center h-[calc(100vh-24px)]" id="landing-pricing">
	<h1 class="font-bold text-4xl pb-5">Pricing</h1>
	<p class="text-slate-500">Affordable plans for any needs. Cancel anytime.</p>
	<div>
		<Tabs.Root value="account" class="w-[400px] flex justify-center items-center p-5">
			<Tabs.List>
				<Tabs.Trigger value="account">Monthly plans</Tabs.Trigger>
				<Tabs.Trigger value="password">Annual plans</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="account"></Tabs.Content>
		</Tabs.Root>
	</div>
	<div class="flex flex-row justify-between gap-6">
		<Card.Root class="h-86 w-86">
			<Card.Header>
				<p class="text-base">Basic</p>
				<Card.Title class="text-4xl">Rp 70,000 <span class="text-base">per month</span></Card.Title>
				<Card.Description class="p-3">
					<ul class="list-outside pl-2 list-disc text-lg">
						<li class="pb-1">Handle 50 order per month</li>
						<li class="pb-1">Feature</li>
						<li class="pb-1">Feature</li>
						<li class="pb-1">Feature</li>
					</ul>
				</Card.Description>
				<Button>Select</Button>
			</Card.Header>
		</Card.Root>
		<Card.Root class="h-72 w-72">
			<Card.Header>
				<p class="text-sm">Standard</p>
				<Card.Title class="text-3xl">Rp 110,000 <span class="text-sm">per month</span></Card.Title>
				<Card.Description class="p-3">
					<ul class="list-outside pl-2 list-disc">
						<li class="pb-1">Handle 100 order per month</li>
						<li class="pb-1">Feature</li>
						<li class="pb-1">Feature</li>
						<li class="pb-1">Feature</li>
					</ul>
				</Card.Description>
				<Button>Select</Button>
			</Card.Header>
		</Card.Root>
		<Card.Root class="h-72 w-72">
			<Card.Header>
				<p class="text-sm">Premium</p>
				<Card.Title class="text-3xl">Rp 150,000 <span class="text-sm">per month</span></Card.Title>
				<Card.Description class="p-3">
					<ul class="list-outside pl-2 list-disc">
						<li class="pb-1">Handle 150 order per month</li>
						<li class="pb-1">Feature</li>
						<li class="pb-1">Feature</li>
						<li class="pb-1">Feature</li>
					</ul>
				</Card.Description>
				<Button>Select</Button>
			</Card.Header>
		</Card.Root>
	</div>
</div>
