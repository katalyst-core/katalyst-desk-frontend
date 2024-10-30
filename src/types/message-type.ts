
export type MessageContent = {
  body: string;
}

export type TicketMessage = {
  message_id: string;
  content: MessageContent;
  is_customer: boolean;
  is_read: boolean;
  timestamp: Date;
};

export type MessageObject = {
  message_id: string;
  content: MessageContent;
  is_customer: boolean;
  is_read: boolean;
  timestamp: Date;
};

export type WsTicketMessage = {
  ticket_id: string;
} & MessageObject;