import type { MessageContent } from "./message-type";

export type TicketListItem = {
  ticket_id: string;
  display_name: string;
  last_message: MessageContent;
  is_customer: boolean;
  is_read: boolean;
  unread_count: number;
  last_message_timestamp: Date;
}

export type WsNewTicket = {
  ticket_id: string;
  display_name: string;
  last_message: MessageContent;
  is_customer: boolean;
  is_read: boolean;
  unread_count: number;
  last_message_timestamp: Date;
}