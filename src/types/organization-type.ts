export type OrganizationListItem = {
  organization_id: string;
  name: string;
}

export type OrganizationObject = {
  organization_id: string;
  name: string;
}

export type CreateOrganizationResponse = {
  organization_id: string;
}

export type OrganizationDashboard = {
  ticket_count: number;
  message_count: number;
  ticket_resolution_time: number;
  message_response_time: number;
  ticket_overview: {
    date: Date;
    Instagram: number;
    WhatsApp: number;
  }[];
  ticket_status: {
    status: string;
    count: number
  }[];
}