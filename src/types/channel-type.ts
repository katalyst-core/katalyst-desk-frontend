export type ChannelTypes = 'instagram' | 'whatsapp';

export type ChannelAccount = {
  channel_account_id: string;
  channel_account_name: string;
  channel_type: ChannelTypes;
}