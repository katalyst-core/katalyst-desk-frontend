import type { MessageContent } from "./message-type";

export type TicketListItem = {
  ticket_id: string;
  display_name: string;
  last_message: MessageContent;
  is_customer: boolean;
  is_read: false;
  unread_count: number;
  last_message_timestamp: string;
}