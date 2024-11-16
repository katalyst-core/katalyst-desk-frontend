import type { MessageContent, MessageStatus } from "./message-type";

export type TicketStatus = 'open' | 'close';

export type TicketListItem = {
  ticket_id: string;
  ticket_code: string;
  ticket_status: TicketStatus;
  display_name: string;
  last_message: MessageContent;
  is_customer: boolean;
  message_status: MessageStatus;
  unread_count: number;
  last_message_timestamp: Date;
}

export type TicketDetails = {
  ticket_id: string;
  ticket_code: string;
  ticket_status: TicketStatus;
  customer_name: string;
};

export type WsNewTicket = {
  ticket_id: string;
  ticket_code: string;
  ticket_status: TicketStatus;
  display_name: string;
  last_message: MessageContent;
  is_customer: boolean;
  message_status: MessageStatus;
  unread_count: number;
  last_message_timestamp: Date;
}