import type { MessageContent, MessageStatus } from './message-type';

export type TicketStatus = 'open' | 'close';

export type TicketListItem = {
	ticket_id: string;
	ticket_code: string;
	ticket_status: TicketStatus;
	display_name: string;
	channel_customer_id: string;
	last_message: MessageContent;
	is_customer: boolean;
	message_status: MessageStatus;
	unread_count: number;
	last_message_timestamp: Date;
	teams: {
		name: string;
	}[];
};

export type TicketTeam = {
	team_id: string;
	name: string;
	active: boolean;
};

export type TicketDetails = {
	ticket_id: string;
	ticket_code: string;
	ticket_status: TicketStatus;
	teams: TicketTeam[];
	customer_name: string;
	expiration: Date;
};

export type WsNewTicket = {
	ticket_id: string;
	ticket_code: string;
	ticket_status: TicketStatus;
	display_name: string;
	channel_customer_id: string;
	last_message: MessageContent;
	is_customer: boolean;
	message_status: MessageStatus;
	unread_count: number;
	last_message_timestamp: Date;
	teams: {
		name: string;
	}[];
};

export type WsTicketUpdate = {
	ticket_id: string;
	message_id?: string;
	message_status?: MessageStatus;
	expiration?: Date;
	ticket_status: TicketStatus;
};
