export type MessageStatus = 'sent' | 'received' | 'read';

export type MessageContent = {
  body: string;
}

export type TicketMessage = {
  message_id: string;
  content: MessageContent;
  is_customer: boolean;
  message_status: MessageStatus;
  timestamp: Date;
};

export type MessageObject = {
  message_id: string;
  content: MessageContent;
  is_customer: boolean;
  message_status: MessageStatus;
  timestamp: Date;
};

export type WsTicketMessage = {
  ticket_id: string;
} & MessageObject;