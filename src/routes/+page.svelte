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

<div class = "flex flex-col items-center justify-center h-[calc(100vh-24px)]" style="background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url('{bg}'); background-size: cover; background-repeat: no-repeat;">
  <h1 class = "font-bold text-5xl/[55px]">Welcome to OmniLink</h1>
  <p class = "p-5 text-slate-500">We make your job easier</p>
  <Button>Get Started</Button>
</div>

<div>
  <h1>Features</h1>
</div>
