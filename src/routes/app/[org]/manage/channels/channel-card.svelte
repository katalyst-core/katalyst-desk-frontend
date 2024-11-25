<script lang="ts">
	import { ChannelAPI } from '$api/index';
	import { Instagram, WhatsApp } from '$lib/images/icons';

	import * as AlertDialog from '$ui/alert-dialog';
	import { Button } from '$ui/button';

	import type { ChannelTypes } from '$types/channel-type';

	interface Props {
		id: string;
		name: string;
		type: ChannelTypes;
		callback: (...args: any[]) => any;
	}

	let { id, name, type, callback }: Props = $props();

	const connectionTypes = {
		instagram: {
			label: 'Instagram',
			icon: Instagram
		},
		whatsapp: {
			label: 'WhatsApp',
			icon: WhatsApp
		}
	};

  let cLabel: string = connectionTypes[type].label;
  let cIcon: string = connectionTypes[type].icon;
	let disconnectDialogOpen: boolean = $state(false);

	const disconnect = async () => {
		const { ok } = await ChannelAPI.deleteChannel(id);

		if (!ok) return;

		disconnectDialogOpen = false;
		callback();
	}
</script>

<div class="w-96 h-48 rounded-md border border-border overflow-hidden flex flex-col justify-between">
	<div
		class="w-full h-20 px-4 py-2 flex items-center space-x-4 bg-accent"
	>
    <img src={cIcon} alt="" class="w-12 h-12" />
		<div>
			<h2>{cLabel}</h2>
			<span>{type == 'instagram' ? '@' : ''}{name}</span>
		</div>
	</div>

  <div class="w-full p-4 flex justify-end">
		<AlertDialog.Root>
			<AlertDialog.Trigger>
				<Button variant="destructive" size="lg">Disconnect</Button>
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>Are you sure?</AlertDialog.Header>
				<AlertDialog.Description>You will be removing access to this channel which includes messages and events.</AlertDialog.Description>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<Button click={async () => disconnect()}>Yes, Disconnect</Button>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
  </div>
</div>
