import { toast } from "svelte-french-toast";
import { fetchApi } from "$lib/custom-fetch";

import { availableOrganizations, selectedOrganization } from "$stores/organization-store";
import type { ApiResponse } from "$types/api";
import type { OrganizationListObject } from "$types/organization-type";

export const fetchAllOrganization = async () => {
  const response: ApiResponse<OrganizationListObject[]> | null = await fetchApi('/organization/get-all');

		if (!response) {
			return;
		}

		if (!response.ok) {
			toast.error('Unable to retrieved stores');
			return;
		}

		const { data: organizations } = response;
		availableOrganizations.set(organizations);

    selectedOrganization.update((organization_id: string | null) => {
      if (organizations.length === 0) {
        return null;
      }

      if (organization_id == null) {
        return organizations[0].organization_id;
      }

      if (!organizations.find((o) => o.organization_id == organization_id)) {
        return organizations[0].organization_id;
      }

      return organization_id;
    });
}