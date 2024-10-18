
export type MessageContent = {
  id: string;
  from: string;
  text: {
    body: string;
  }
  type: string;
  timestamp: string;
}

export type TicketMessage = {
  message_id: string;
  content: MessageContent;
  is_customer: boolean;
  is_read: boolean;
  timestamp: string;
};