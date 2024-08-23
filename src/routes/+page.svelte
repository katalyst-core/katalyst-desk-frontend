<script>
	import { Button } from '$ui/button';
	import img from '$lib/images/logo_omni.svg';
  import bg from '$lib/images/bg.png';
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

<div class = "flex flex-col items-center justify-center h-[calc(100vh-24px)] border-b-2 border-slate-100" style="background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url('{bg}'); background-size: cover; background-repeat: no-repeat;">
  <h1 class = "font-bold text-5xl/[55px]">Welcome to OmniLink</h1>
  <p class = "p-5 text-slate-500">We make your job easier</p>
  <Button>Get Started</Button>
</div>

<div class = "flex flex-col pt-4 ">
  <h1 class = "font-bold text-5xl text-center pb-12">Features</h1>
	<div class = "flex w-4/12 flex-col items-start justify-start px-[12px] text-left pl-16 pb-12">
		<p class = "font-semibold">Insightful Analytics</p>
		<p>OmniLink delivers detailed insights from all your sales channels, helping you make data-driven decisions to drive business growth.</p>
	</div>
	<div class = "flex w-4/12 flex-col items-start justify-start px-[12px] text-left pl-16 pb-12">
		<p class = "font-semibold">Comprehensive Data Management</p>
		<p>Efficiently manage and analyze data from various channels, providing tools to handle your data inventory in one platform.</p>
	</div>
</div>
