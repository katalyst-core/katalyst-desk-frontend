import { toast } from "svelte-french-toast";
import { fetchApi } from "$lib/custom-fetch";

import type { ApiResponse } from "$types/api-type";

export const deleteTeam = async (teamId: string) => {
	try {
		const response: ApiResponse | null = await fetchApi(`/team/${teamId}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			const message = response.message;

			toast.error(message);
		}

		return response;
	} catch (err) {
		void err;
		toast.error('An error occurred');
		return null;
	}
};
