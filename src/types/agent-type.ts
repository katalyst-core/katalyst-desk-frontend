export type AgentInfoResponse = {
	name: string;
	email: string;
};

export type AgentListItem = {
	agent_id: string;
	name: string;
  email: string;
	teams: {
		team_id: string;
		name: string;
	}[];
	timestamp: Date;
};
